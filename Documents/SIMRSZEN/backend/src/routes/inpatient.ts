import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all inpatients
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, roomId, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = String(patientId);
    }

    if (roomId) {
      whereClause.roomId = String(roomId);
    }

    if (status) {
      whereClause.status = String(status);
    }

    const inpatients = await db.inpatient.findMany({
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
            dateOfBirth: true
          }
        },
        visit: {
          select: {
            id: true,
            complaint: true,
            createdAt: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true,
            floor: true
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
      orderBy: { admissionDate: 'desc' }
    });

    const total = await db.inpatient.count({ where: whereClause });

    res.json({
      data: inpatients,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching inpatients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get inpatient by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const inpatient = await db.inpatient.findUnique({
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
        room: {
          select: {
            id: true,
            name: true,
            type: true,
            floor: true,
            capacity: true
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

    if (!inpatient) {
      return res.status(404).json({ error: 'Inpatient not found' });
    }

    res.json(inpatient);
  } catch (error) {
    console.error('Error fetching inpatient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new inpatient admission
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patientId,
      visitId,
      roomId,
      attendingDoctorId,
      diagnosis,
      treatment,
      notes
    } = req.body;

    // Validate required fields
    if (!patientId || !visitId || !roomId || !attendingDoctorId) {
      return res.status(400).json({ error: 'Patient ID, visit ID, room ID, and attending doctor ID are required' });
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

    // Check if room exists
    const room = await db.room.findUnique({
      where: { id: roomId }
    });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Check if doctor exists
    const doctor = await db.doctor.findUnique({
      where: { id: attendingDoctorId }
    });

    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Check if room is available
    if (room.available <= 0) {
      return res.status(400).json({ error: 'Room is not available' });
    }

    // Create the inpatient record
    const newInpatient = await db.$transaction(async (tx) => {
      // Create the inpatient admission
      const inpatient = await tx.inpatient.create({
        data: {
          patientId,
          visitId,
          roomId,
          attendingDoctor: attendingDoctorId,
          diagnosis: diagnosis || null,
          treatment: treatment || null,
          notes: notes || null,
          status: 'admitted'
        }
      });

      // Update room availability
      await tx.room.update({
        where: { id: roomId },
        data: {
          available: { decrement: 1 }
        }
      });

      // Update visit status to inpatient
      await tx.visit.update({
        where: { id: visitId },
        data: { status: 'inpatient' }
      });

      return inpatient;
    });

    // Fetch the complete inpatient record with relations
    const completeInpatient = await db.inpatient.findUnique({
      where: { id: newInpatient.id },
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
        room: {
          select: {
            id: true,
            name: true,
            type: true
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

    res.status(201).json(completeInpatient);
  } catch (error) {
    console.error('Error creating inpatient admission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update inpatient record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      diagnosis,
      treatment,
      notes,
      status
    } = req.body;

    const inpatient = await db.inpatient.findUnique({
      where: { id }
    });

    if (!inpatient) {
      return res.status(404).json({ error: 'Inpatient not found' });
    }

    const updatedInpatient = await db.inpatient.update({
      where: { id },
      data: {
        diagnosis: diagnosis || inpatient.diagnosis,
        treatment: treatment || inpatient.treatment,
        notes: notes || inpatient.notes,
        status: status || inpatient.status,
        updatedAt: new Date()
      }
    });

    res.json(updatedInpatient);
  } catch (error) {
    console.error('Error updating inpatient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Discharge inpatient
router.patch('/:id/discharge', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { dischargeDate, finalDiagnosis, finalTreatment } = req.body;

    const inpatient = await db.inpatient.findUnique({
      where: { id }
    });

    if (!inpatient) {
      return res.status(404).json({ error: 'Inpatient not found' });
    }

    if (inpatient.status === 'discharged') {
      return res.status(400).json({ error: 'Patient is already discharged' });
    }

    const updatedInpatient = await db.$transaction(async (tx) => {
      // Update inpatient record
      const updated = await tx.inpatient.update({
        where: { id },
        data: {
          status: 'discharged',
          dischargeDate: dischargeDate ? new Date(dischargeDate) : new Date(),
          diagnosis: finalDiagnosis || inpatient.diagnosis,
          treatment: finalTreatment || inpatient.treatment,
          updatedAt: new Date()
        }
      });

      // Update room availability
      await tx.room.update({
        where: { id: inpatient.roomId },
        data: {
          available: { increment: 1 }
        }
      });

      // Update visit status
      await tx.visit.update({
        where: { id: inpatient.visitId },
        data: { status: 'completed' }
      });

      return updated;
    });

    res.json(updatedInpatient);
  } catch (error) {
    console.error('Error discharging patient:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;