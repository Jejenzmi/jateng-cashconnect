import { Router } from 'express';
import { db } from '../config/database';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get hospital profile
router.get('/check-profile', async (req, res) => {
  try {
    const profile = await db.hospitalProfile.findFirst({
      where: { isActive: true }
    });

    if (!profile) {
      return res.status(200).json({ exists: false });
    }

    res.json({
      exists: true,
      profile: {
        id: profile.id,
        name: profile.name,
        code: profile.code,
        address: profile.address,
        phone: profile.phone,
        fax: profile.fax,
        email: profile.email,
        website: profile.website,
        faskesType: profile.faskesType,
        bpjsConfig: profile.bpjsConfig,
        isActive: profile.isActive
      }
    });
  } catch (error) {
    console.error('Error checking profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Setup hospital profile
router.post('/setup', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      phone,
      fax,
      email,
      website,
      faskesType,
      bpjsConfig
    } = req.body;

    // Validate required fields
    if (!name || !code || !address || !phone) {
      return res.status(400).json({ error: 'Name, code, address, and phone are required' });
    }

    // Check if profile already exists
    const existingProfile = await db.hospitalProfile.findFirst({
      where: { isActive: true }
    });

    if (existingProfile) {
      return res.status(409).json({ error: 'Hospital profile already exists' });
    }

    const profile = await db.hospitalProfile.create({
      data: {
        name,
        code,
        address,
        phone,
        fax: fax || null,
        email: email || null,
        website: website || null,
        faskesType: faskesType || 'RUMAH_SAKIT',
        bpjsConfig: bpjsConfig || null
      }
    });

    res.status(201).json({
      message: 'Hospital profile created successfully',
      profile
    });
  } catch (error) {
    console.error('Error setting up profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Update hospital profile
router.put('/update', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      code,
      address,
      phone,
      fax,
      email,
      website,
      faskesType,
      bpjsConfig
    } = req.body;

    const profile = await db.hospitalProfile.findFirst({
      where: { isActive: true }
    });

    if (!profile) {
      return res.status(404).json({ error: 'Hospital profile not found' });
    }

    const updatedProfile = await db.hospitalProfile.update({
      where: { id: profile.id },
      data: {
        name: name || profile.name,
        code: code || profile.code,
        address: address || profile.address,
        phone: phone || profile.phone,
        fax: fax !== undefined ? fax : profile.fax,
        email: email !== undefined ? email : profile.email,
        website: website !== undefined ? website : profile.website,
        faskesType: faskesType || profile.faskesType,
        bpjsConfig: bpjsConfig !== undefined ? bpjsConfig : profile.bpjsConfig,
        updatedAt: new Date()
      }
    });

    res.json({
      message: 'Hospital profile updated successfully',
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return; // Ensure all code paths return a value
});

// Get available faskes types
router.get('/faskes-types', (_req, res) => {
  res.json({
    types: [
      { value: 'RUMAH_SAKIT', label: 'Rumah Sakit' },
      { value: 'KLINIK', label: 'Klinik' },
      { value: 'PUSKESMAS', label: 'Puskesmas' },
      { value: 'APOTEK', label: 'Apotek' },
      { value: 'LAINNYA', label: 'Lainnya' }
    ]
  });
});

// Update BPJS Config only
router.post('/update-bpjs', async (req, res) => {
  try {
    const { bpjsConfig } = req.body;

    const profile = await db.hospitalProfile.findFirst({
      where: { isActive: true }
    });

    if (profile) {
      await db.hospitalProfile.update({
        where: { id: profile.id },
        data: { bpjsConfig: bpjsConfig || null, updatedAt: new Date() }
      });
    } else {
      await db.hospitalProfile.create({
        data: {
          name: 'SIMRS ZEN Hospital',
          code: 'SIMRSZEN',
          address: '-',
          phone: '-',
          email: '-',
          faskesType: 'RUMAH_SAKIT',
          bpjsConfig: bpjsConfig || null,
        }
      });
    }

    res.json({ message: 'BPJS config saved successfully' });
  } catch (error) {
    console.error('Error saving BPJS config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  return;
});

export default router;