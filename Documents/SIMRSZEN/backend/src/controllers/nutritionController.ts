import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { validationResult } from 'express-validator';

const prisma = new PrismaClient();

// Controller untuk manajemen asesmen gizi pasien
export const getAllPatientAssessments = async (req: Request, res: Response) => {
  try {
    const assessments = await prisma.patientNutritionAssessment.findMany({
      where: {
        deletedAt: null // Hanya ambil asesmen yang belum dihapus
      },
      include: {
        patient: true,
        nutritionist: true
      },
      orderBy: {
        assessmentDate: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: assessments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar asesmen gizi pasien',
      error: (error as Error).message
    });
  }
};

export const getPatientAssessmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const assessment = await prisma.patientNutritionAssessment.findUnique({
      where: { id },
      include: {
        patient: true,
        nutritionist: true
      }
    });
    
    if (!assessment || assessment.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Asesmen gizi pasien tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: assessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil asesmen gizi pasien',
      error: (error as Error).message
    });
  }
};

export const createPatientAssessment = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { 
      patientId, 
      nutritionistId, 
      weight, 
      height, 
      bmi, 
      nutritionalStatus, 
      dietaryHabits,
      allergies,
      specialDietRequirements,
      assessmentNotes
    } = req.body;

    const newAssessment = await prisma.patientNutritionAssessment.create({
      data: {
        patientId,
        nutritionistId,
        weight: parseFloat(weight),
        height: parseFloat(height),
        bmi: parseFloat(bmi),
        nutritionalStatus,
        dietaryHabits,
        allergies,
        specialDietRequirements,
        assessmentNotes
      }
    });

    res.status(201).json({
      success: true,
      message: 'Asesmen gizi pasien berhasil ditambahkan',
      data: newAssessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan asesmen gizi pasien',
      error: (error as Error).message
    });
  }
};

export const updatePatientAssessment = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { 
      weight, 
      height, 
      bmi, 
      nutritionalStatus, 
      dietaryHabits,
      allergies,
      specialDietRequirements,
      assessmentNotes
    } = req.body;

    const updatedAssessment = await prisma.patientNutritionAssessment.update({
      where: { id },
      data: {
        weight: parseFloat(weight),
        height: parseFloat(height),
        bmi: parseFloat(bmi),
        nutritionalStatus,
        dietaryHabits,
        allergies,
        specialDietRequirements,
        assessmentNotes
      }
    });

    res.status(200).json({
      success: true,
      message: 'Asesmen gizi pasien berhasil diperbarui',
      data: updatedAssessment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui asesmen gizi pasien',
      error: (error as Error).message
    });
  }
};

export const deletePatientAssessment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.patientNutritionAssessment.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Asesmen gizi pasien berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus asesmen gizi pasien',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen rencana makanan
export const getAllMealPlans = async (req: Request, res: Response) => {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      where: {
        deletedAt: null
      },
      include: {
        patient: true,
        nutritionist: true
      },
      orderBy: {
        startDate: 'desc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: mealPlans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar rencana makanan',
      error: (error as Error).message
    });
  }
};

export const getMealPlanById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id },
      include: {
        patient: true,
        nutritionist: true,
        meals: true
      }
    });
    
    if (!mealPlan || mealPlan.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Rencana makanan tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: mealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil rencana makanan',
      error: (error as Error).message
    });
  }
};

export const createMealPlan = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { 
      patientId, 
      nutritionistId, 
      planName, 
      description,
      startDate,
      endDate,
      dietType,
      specialInstructions,
      meals
    } = req.body;

    const newMealPlan = await prisma.mealPlan.create({
      data: {
        patientId,
        nutritionistId,
        planName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        dietType,
        specialInstructions,
        meals: meals || []
      }
    });

    res.status(201).json({
      success: true,
      message: 'Rencana makanan berhasil ditambahkan',
      data: newMealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan rencana makanan',
      error: (error as Error).message
    });
  }
};

export const updateMealPlan = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { 
      planName, 
      description,
      startDate,
      endDate,
      dietType,
      specialInstructions,
      meals
    } = req.body;

    const updatedMealPlan = await prisma.mealPlan.update({
      where: { id },
      data: {
        planName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        dietType,
        specialInstructions,
        meals: meals || []
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rencana makanan berhasil diperbarui',
      data: updatedMealPlan
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui rencana makanan',
      error: (error as Error).message
    });
  }
};

export const deleteMealPlan = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.mealPlan.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Rencana makanan berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus rencana makanan',
      error: (error as Error).message
    });
  }
};

// Controller untuk manajemen ahli gizi
export const getAllNutritionists = async (req: Request, res: Response) => {
  try {
    const nutritionists = await prisma.nutritionist.findMany({
      where: {
        deletedAt: null
      },
      include: {
        assessments: true,
        mealPlans: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    res.status(200).json({
      success: true,
      data: nutritionists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil daftar ahli gizi',
      error: (error as Error).message
    });
  }
};

export const getNutritionistById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const nutritionist = await prisma.nutritionist.findUnique({
      where: { id },
      include: {
        assessments: true,
        mealPlans: true
      }
    });
    
    if (!nutritionist || nutritionist.deletedAt) {
      return res.status(404).json({
        success: false,
        message: 'Ahli gizi tidak ditemukan'
      });
    }
    
    res.status(200).json({
      success: true,
      data: nutritionist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data ahli gizi',
      error: (error as Error).message
    });
  }
};

export const createNutritionist = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { 
      name, 
      licenseNumber, 
      specialization,
      contactInfo
    } = req.body;

    const newNutritionist = await prisma.nutritionist.create({
      data: {
        name,
        licenseNumber,
        specialization,
        contactInfo
      }
    });

    res.status(201).json({
      success: true,
      message: 'Ahli gizi berhasil ditambahkan',
      data: newNutritionist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menambahkan ahli gizi',
      error: (error as Error).message
    });
  }
};

export const updateNutritionist = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validasi gagal',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { 
      name, 
      licenseNumber, 
      specialization,
      contactInfo
    } = req.body;

    const updatedNutritionist = await prisma.nutritionist.update({
      where: { id },
      data: {
        name,
        licenseNumber,
        specialization,
        contactInfo
      }
    });

    res.status(200).json({
      success: true,
      message: 'Ahli gizi berhasil diperbarui',
      data: updatedNutritionist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui ahli gizi',
      error: (error as Error).message
    });
  }
};

export const deleteNutritionist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Soft delete - hanya mengubah deletedAt
    await prisma.nutritionist.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.status(200).json({
      success: true,
      message: 'Ahli gizi berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus ahli gizi',
      error: (error as Error).message
    });
  }
};