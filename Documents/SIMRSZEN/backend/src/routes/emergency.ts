import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all emergency cases
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, status, triageLevel } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = String(patientId);
    }

    if (status) {
      whereClause.status = String(status);
    }

    if (triageLevel) {
      whereClause.triageLevel = String(triageLevel);
    }

    const emergencies = await db.emergency.findMany({
      where: whereClause,
      skip,
      take: Number(limit),
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
            gender: true,
            dateOfBirth: true,
            phone: true
          }
        },
        visit: {
          select: {
            id: true,
            complaint: true,
            createdAt: true
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true
          }
        }
      },
      orderBy: { arrivalDateTime: 'desc' }
    });

    const total = await db.emergency.count({ where: whereClause });

    res.json({
      data: emergencies,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching emergency cases:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get emergency case by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const emergency = await db.emergency.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
            gender: true,
            dateOfBirth: true,
            phone: true,
            address: true
          }
        },
        visit: {
          select: {
            id: true,
            complaint: true,
            diagnosis: true,
            treatment: true,
            createdAt: true
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            phone: true,
            email: true
          }
        }
      }
    });

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency case not found' });
    }

    res.json(emergency);
  } catch (error) {
    console.error('Error fetching emergency case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new emergency case
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patientId,
      visitId,
      triageLevel,
      chiefComplaint,
      attendingDoctorId,
      diagnosis,
      treatment,
      disposition
    } = req.body;

    // Validate required fields
    if (!patientId || !visitId || !triageLevel || !chiefComplaint) {
      return res.status(400).json({ error: 'Patient ID, visit ID, triage level, and chief complaint are required' });
    }

    // Check if patient exists
    const patient = await db.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    // Check if visit exists
    const visit = await db.visit.findUnique({
      where: { id: visitId }
    });

    if (!visit) {
      return res.status(404).json({ error: 'Visit not found' });
    }

    // Check if doctor exists if provided
    if (attendingDoctorId) {
      const doctor = await db.doctor.findUnique({
        where: { id: attendingDoctorId }
      });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
    }

    // Create the emergency case
    const newEmergency = await db.emergency.create({
      data: {
        patientId,
        visitId,
        triageLevel,
        chiefComplaint,
        attendingDoctor: attendingDoctorId || null,
        diagnosis: diagnosis || null,
        treatment: treatment || null,
        disposition: disposition || 'home' // Default disposition
      }
    });

    // Update visit status to emergency
    await db.visit.update({
      where: { id: visitId },
      data: { status: 'emergency' }
    });

    // Fetch the complete emergency record with relations
    const completeEmergency = await db.emergency.findUnique({
      where: { id: newEmergency.id },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
            nik: true,
            gender: true
          }
        },
        visit: {
          select: {
            id: true,
            complaint: true
          }
        },
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true
          }
        }
      }
    });

    res.status(201).json(completeEmergency);
  } catch (error) {
    console.error('Error creating emergency case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update emergency case
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      triageLevel,
      chiefComplaint,
      attendingDoctorId,
      diagnosis,
      treatment,
      disposition,
      examinationDateTime,
      dischargeDateTime
    } = req.body;

    const emergency = await db.emergency.findUnique({
      where: { id }
    });

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency case not found' });
    }

    // Check if doctor exists if provided
    if (attendingDoctorId) {
      const doctor = await db.doctor.findUnique({
        where: { id: attendingDoctorId }
      });

      if (!doctor) {
        return res.status(404).json({ error: 'Doctor not found' });
      }
    }

    const updatedEmergency = await db.emergency.update({
      where: { id },
      data: {
        triageLevel: triageLevel || emergency.triageLevel,
        chiefComplaint: chiefComplaint || emergency.chiefComplaint,
        attendingDoctor: attendingDoctorId || emergency.attendingDoctor,
        diagnosis: diagnosis || emergency.diagnosis,
        treatment: treatment || emergency.treatment,
        disposition: disposition || emergency.disposition,
        examinationDateTime: examinationDateTime ? new Date(examinationDateTime) : emergency.examinationDateTime,
        dischargeDateTime: dischargeDateTime ? new Date(dischargeDateTime) : emergency.dischargeDateTime,
        updatedAt: new Date()
      }
    });

    res.json(updatedEmergency);
  } catch (error) {
    console.error('Error updating emergency case:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Discharge patient from emergency
router.patch('/:id/discharge', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { disposition, dischargeDateTime } = req.body;

    const emergency = await db.emergency.findUnique({
      where: { id }
    });

    if (!emergency) {
      return res.status(404).json({ error: 'Emergency case not found' });
    }

    if (emergency.disposition !== 'home' && emergency.dischargeDateTime) {
      return res.status(400).json({ error: 'Patient is already discharged' });
    }

    const updatedEmergency = await db.emergency.update({
      where: { id },
      data: {
        disposition: disposition || emergency.disposition,
        dischargeDateTime: dischargeDateTime ? new Date(dischargeDateTime) : new Date(),
        updatedAt: new Date()
      }
    });

    // Update visit status
    await db.visit.update({
      where: { id: emergency.visitId },
      data: { status: 'completed' }
    });

    res.json(updatedEmergency);
  } catch (error) {
    console.error('Error discharging patient from emergency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;