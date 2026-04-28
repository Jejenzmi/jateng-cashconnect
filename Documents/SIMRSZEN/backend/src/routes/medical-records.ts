import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all medical records
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, patientId, doctorId, dateFrom, dateTo } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const whereClause: any = {};

    if (patientId) {
      whereClause.patientId = String(patientId);
    }

    if (doctorId) {
      whereClause.doctorId = String(doctorId);
    }

    if (dateFrom || dateTo) {
      whereClause.createdAt = {};
      if (dateFrom) {
        whereClause.createdAt.gte = new Date(String(dateFrom));
      }
      if (dateTo) {
        whereClause.createdAt.lte = new Date(String(dateTo));
      }
    }

    const medicalRecords = await db.visit.findMany({
      where: {
        ...whereClause,
        isDeleted: false
      },
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
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        prescriptions: {
          include: {
            items: {
              include: {
                medicine: {
                  select: {
                    id: true,
                    name: true,
                    dosageForm: true
                  }
                }
              }
            }
          }
        },
        labOrders: {
          include: {
            tests: {
              include: {
                test: {
                  select: {
                    id: true,
                    name: true,
                    code: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await db.visit.count({ 
      where: {
        ...whereClause,
        isDeleted: false
      } 
    });

    res.json({
      data: medicalRecords,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get medical record by visit ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const medicalRecord = await db.visit.findUnique({
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
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true,
            phone: true,
            email: true
          }
        },
        room: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        prescriptions: {
          include: {
            items: {
              include: {
                medicine: {
                  select: {
                    id: true,
                    name: true,
                    dosageForm: true,
                    strength: true
                  }
                }
              }
            }
          }
        },
        labOrders: {
          include: {
            tests: {
              include: {
                test: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                    description: true,
                    normalValues: true
                  }
                },
                order: {
                  select: {
                    orderedBy: {
                      select: {
                        fullName: true
                      }
                    }
                  }
                }
              }
            }
          }
        },
        bills: {
          include: {
            items: true
          }
        }
      }
    });

    if (!medicalRecord || medicalRecord.isDeleted) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    res.json(medicalRecord);
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get patient's medical history
router.get('/patient/:patientId/history', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const medicalHistory = await db.visit.findMany({
      where: {
        patientId,
        isDeleted: false
      },
      skip,
      take: Number(limit),
      include: {
        doctor: {
          select: {
            id: true,
            fullName: true,
            specialization: true
          }
        },
        room: {
          select: {
            id: true,
            name: true
          }
        },
        prescriptions: {
          select: {
            id: true,
            items: {
              select: {
                medicine: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const total = await db.visit.count({
      where: {
        patientId,
        isDeleted: false
      }
    });

    res.json({
      data: medicalHistory,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching patient medical history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update medical record
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      complaint,
      diagnosis,
      treatment,
      vitalSigns,
      notes
    } = req.body;

    const medicalRecord = await db.visit.findUnique({
      where: { id }
    });

    if (!medicalRecord || medicalRecord.isDeleted) {
      return res.status(404).json({ error: 'Medical record not found' });
    }

    const updatedRecord = await db.visit.update({
      where: { id },
      data: {
        complaint: complaint || medicalRecord.complaint,
        diagnosis: diagnosis || medicalRecord.diagnosis,
        treatment: treatment || medicalRecord.treatment,
        vitalSigns: vitalSigns !== undefined ? vitalSigns : medicalRecord.vitalSigns,
        notes: notes || medicalRecord.notes,
        updatedAt: new Date()
      }
    });

    res.json(updatedRecord);
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get medical statistics for dashboard
router.get('/statistics', authenticateToken, async (req, res) => {
  try {
    // Total patients
    const totalPatients = await db.patient.count();
    
    // Total visits
    const totalVisits = await db.visit.count();
    
    // Total visits this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyVisits = await db.visit.count({
      where: {
        createdAt: {
          gte: startOfMonth
        }
      }
    });
    
    // Top doctors by number of visits
    const topDoctors = await db.visit.groupBy({
      by: ['doctorId'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 5,
      where: {
        isDeleted: false
      }
    });
    
    // Get doctor details for the top doctors
    const doctorIds = topDoctors.map(d => d.doctorId);
    const doctorDetails = await db.doctor.findMany({
      where: {
        id: {
          in: doctorIds
        }
      },
      select: {
        id: true,
        fullName: true,
        specialization: true
      }
    });
    
    const topDoctorsWithDetails = topDoctors.map(record => {
      const doctor = doctorDetails.find(d => d.id === record.doctorId);
      return {
        ...record,
        doctor
      };
    });

    res.json({
      totalPatients,
      totalVisits,
      monthlyVisits,
      topDoctors: topDoctorsWithDetails
    });
  } catch (error) {
    console.error('Error fetching medical statistics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

export default router;

