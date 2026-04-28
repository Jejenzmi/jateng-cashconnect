import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all ICU stays
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, bedId, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = String(patientId);
    }

    if (bedId) {
      whereClause.bedId = String(bedId);
    }

    if (status) {
      whereClause.status = String(status);
    }

    const icuStays = await db.icuStay.findMany({
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
        bed: {
          select: {
            id: true,
            name: true,
            type: true,
            roomId: true,
            room: {
              select: {
                name: true,
                type: true
              }
            }
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

    const total = await db.icuStay.count({ where: whereClause });

    res.json({
      data: icuStays,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching ICU stays:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get ICU stay by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const icuStay = await db.icuStay.findUnique({
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
        bed: {
          select: {
            id: true,
            name: true,
            type: true,
            status: true,
            roomId: true,
            room: {
              select: {
                id: true,
                name: true,
                type: true
              }
            }
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

    if (!icuStay) {
      return res.status(404).json({ error: 'ICU stay not found' });
    }

    res.json(icuStay);
  } catch (error) {
    console.error('Error fetching ICU stay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Create new ICU admission
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      patientId,
      visitId,
      bedId,
      attendingDoctorId,
      diagnosis,
      treatment,
      notes
    } = req.body;

    // Validate required fields
    if (!patientId || !visitId || !bedId) {
      return res.status(400).json({ error: 'Patient ID, visit ID, and bed ID are required' });
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

    // Check if bed exists
    const bed = await db.bed.findUnique({
      where: { id: bedId }
    });

    if (!bed) {
      return res.status(404).json({ error: 'Bed not found' });
    }

    // Check if bed is available
    if (bed.status !== 'available') {
      return res.status(400).json({ error: 'Bed is not available' });
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

    // Create the ICU stay
    const newIcuStay = await db.$transaction(async (tx) => {
      // Update bed status
      await tx.bed.update({
        where: { id: bedId },
        data: { status: 'occupied' }
      });

      // Create ICU stay record
      const icuStay = await tx.icuStay.create({
        data: {
          patientId,
          visitId,
          bedId,
          attendingDoctor: attendingDoctorId || null,
          diagnosis: diagnosis || null,
          treatment: treatment || null,
          notes: notes || null,
          status: 'admitted'
        }
      });

      // Update visit status to ICU
      await tx.visit.update({
        where: { id: visitId },
        data: { status: 'icu' }
      });

      return icuStay;
    });

    // Fetch the complete ICU stay record with relations
    const completeIcuStay = await db.icuStay.findUnique({
      where: { id: newIcuStay.id },
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
        bed: {
          select: {
            id: true,
            name: true,
            type: true,
            room: {
              select: {
                name: true
              }
            }
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

    res.status(201).json(completeIcuStay);
  } catch (error) {
    console.error('Error creating ICU admission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update ICU stay
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      diagnosis,
      treatment,
      notes,
      attendingDoctorId
    } = req.body;

    const icuStay = await db.icuStay.findUnique({
      where: { id }
    });

    if (!icuStay) {
      return res.status(404).json({ error: 'ICU stay not found' });
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

    const updatedIcuStay = await db.icuStay.update({
      where: { id },
      data: {
        diagnosis: diagnosis || icuStay.diagnosis,
        treatment: treatment || icuStay.treatment,
        notes: notes || icuStay.notes,
        attendingDoctor: attendingDoctorId || icuStay.attendingDoctor,
        updatedAt: new Date()
      }
    });

    res.json(updatedIcuStay);
  } catch (error) {
    console.error('Error updating ICU stay:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Discharge patient from ICU
router.patch('/:id/discharge', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { dischargeDate, finalDiagnosis, finalTreatment } = req.body;

    const icuStay = await db.icuStay.findUnique({
      where: { id }
    });

    if (!icuStay) {
      return res.status(404).json({ error: 'ICU stay not found' });
    }

    if (icuStay.status === 'discharged') {
      return res.status(400).json({ error: 'Patient is already discharged from ICU' });
    }

    const updatedIcuStay = await db.$transaction(async (tx) => {
      // Update bed status to available
      await tx.bed.update({
        where: { id: icuStay.bedId },
        data: { status: 'available' }
      });

      // Update ICU stay record
      const updated = await tx.icuStay.update({
        where: { id },
        data: {
          status: 'discharged',
          dischargeDate: dischargeDate ? new Date(dischargeDate) : new Date(),
          diagnosis: finalDiagnosis || icuStay.diagnosis,
          treatment: finalTreatment || icuStay.treatment,
          updatedAt: new Date()
        }
      });

      // Update visit status
      await tx.visit.update({
        where: { id: icuStay.visitId },
        data: { status: 'completed' }
      });

      return updated;
    });

    res.json(updatedIcuStay);
  } catch (error) {
    console.error('Error discharging patient from ICU:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get available ICU beds
router.get('/beds/available', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    const whereClause: any = {
      type: {
        contains: 'ICU', // Beds with ICU in the type
      },
      status: 'available'
    };

    if (type) {
      whereClause.type = String(type);
    }

    const availableBeds = await db.bed.findMany({
      where: whereClause,
      include: {
        room: {
          select: {
            id: true,
            name: true,
            type: true
          }
        }
      }
    });

    res.json(availableBeds);
  } catch (error) {
    console.error('Error fetching available ICU beds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;