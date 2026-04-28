import { Request, Response } from 'express';
import { db } from '../config/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

interface SetupRequestBody {
  hospitalInfo: {
    name: string;
    code: string;
    type: string;
    address: string;
    city: string;
    province: string;
    phone: string;
    email: string;
  };
  adminUser: {
    fullName: string;
    email: string;
    password: string;
  };
  modules: {
    activeModules: string[];
  };
}

export const setupSystem = async (req: Request, res: Response) => {
  try {
    const { hospitalInfo, adminUser, modules }: SetupRequestBody = req.body;

    // Validate required fields
    if (!hospitalInfo.name || !hospitalInfo.code || !adminUser.email || !adminUser.password) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Check if setup has already been completed
    const existingConfig = await db.systemConfig.findUnique({
      where: { key: 'setup_completed' }
    });
    
    if (existingConfig?.value === 'true') {
      return res.status(400).json({ error: 'System has already been set up' });
    }

    // Hash the admin password
    const hashedPassword = await bcrypt.hash(adminUser.password, 12);

    // Create hospital profile
    const hospitalProfile = await db.hospitalProfile.create({
      data: {
        name: hospitalInfo.name,
        code: hospitalInfo.code,
        type: hospitalInfo.type,
        address: hospitalInfo.address,
        city: hospitalInfo.city,
        province: hospitalInfo.province,
        phone: hospitalInfo.phone,
        email: hospitalInfo.email,
        isActive: true,
      },
    });

    // Create admin user
    const adminUserCreated = await db.user.create({
      data: {
        nip: `ADMIN-${uuidv4().substring(0, 8)}`,
        fullName: adminUser.fullName || 'Administrator',
        email: adminUser.email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    // Activate selected modules
    if (modules.activeModules && modules.activeModules.length > 0) {
      // Get the FaskesType based on the hospital type
      let faskesType = await db.faskesType.findFirst({
        where: { name: hospitalInfo.type.toUpperCase() },
      });

      if (!faskesType) {
        faskesType = await db.faskesType.create({
          data: {
            name: hospitalInfo.type.toUpperCase(),
            description: `Faskes type for ${hospitalInfo.type}`,
          },
        });
      }

      // Activate modules for this faskes type
      for (const moduleId of modules.activeModules) {
        const module = await db.module.findFirst({
          where: { code: moduleId },
        });

        if (module) {
          await db.faskesModuleConfig.upsert({
            where: {
              moduleId_faskesTypeId: {
                moduleId: module.id,
                faskesTypeId: faskesType.id,
              },
            },
            update: {
              isEnabled: true,
            },
            create: {
              moduleId: module.id,
              faskesTypeId: faskesType.id,
              isEnabled: true,
            },
          });
        }
      }
    }

    // Mark setup as completed
    await db.systemConfig.upsert({
      where: { key: 'setup_completed' },
      update: { value: 'true' },
      create: { 
        key: 'setup_completed', 
        value: 'true',
        description: 'Indicates whether the initial system setup has been completed'
      },
    });

    res.status(201).json({
      message: 'System setup completed successfully',
      hospitalProfile,
      adminUser: {
        id: adminUserCreated.id,
        email: adminUserCreated.email,
        fullName: adminUserCreated.fullName,
      },
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Internal server error during setup' });
  }
};

export const checkSetupStatus = async (req: Request, res: Response) => {
  try {
    // Check if system has been set up by looking for setup completion flag
    const setupConfig = await db.systemConfig.findUnique({
      where: { key: 'setup_completed' },
    });
    
    if (setupConfig && setupConfig.value === 'true') {
      res.json({ 
        setupCompleted: true,
        message: 'System is already set up' 
      });
    } else {
      res.json({ 
        setupCompleted: false,
        message: 'System needs to be set up' 
      });
    }
  } catch (error) {
    console.error('Check setup status error:', error);
    res.status(500).json({ error: 'Internal server error checking setup status' });
  }
};