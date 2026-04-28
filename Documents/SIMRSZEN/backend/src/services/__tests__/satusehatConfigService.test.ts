import { SatuSehatConfigService } from '../satusehatConfigService';

describe('SatuSehatConfigService', () => {
  describe('createOrUpdate', () => {
    it('should validate input data', async () => {
      // Arrange
      const invalidData = {
        clientId: '',
        clientSecret: 'valid-secret',
        baseUrl: 'invalid-url',
        authUrl: 'also-invalid',
        organizationId: 'valid-org-id',
      };

      // Act & Assert
      await expect(SatuSehatConfigService.createOrUpdate(invalidData as any)).rejects.toThrow('Validasi gagal');
    });
  });

  describe('getConfig', () => {
    it('should return existing configuration', async () => {
      // Arrange
      const expectedConfig = {
        id: 'test-id',
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        baseUrl: 'https://test.example.com',
        authUrl: 'https://auth.test.example.com',
        organizationId: 'test-org-id',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.satuSehatConfig.findFirst as jest.MockedFunction<any>).mockResolvedValue(expectedConfig);

      // Act
      const result = await SatuSehatConfigService.getConfig();

      // Assert
      expect(mockPrisma.satuSehatConfig.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedConfig);
    });

    it('should return null if no configuration exists', async () => {
      // Arrange
      (mockPrisma.satuSehatConfig.findFirst as jest.MockedFunction<any>).mockResolvedValue(null);

      // Act
      const result = await SatuSehatConfigService.getConfig();

      // Assert
      expect(mockPrisma.satuSehatConfig.findFirst).toHaveBeenCalledTimes(1);
      expect(result).toBeNull();
    });
  });

  describe('deleteConfig', () => {
    it('should delete all configurations', async () => {
      // Arrange
      (mockPrisma.satuSehatConfig.deleteMany as jest.MockedFunction<any>).mockResolvedValue({ count: 1 });

      // Act
      const result = await SatuSehatConfigService.deleteConfig();

      // Assert
      expect(mockPrisma.satuSehatConfig.deleteMany).toHaveBeenCalledWith({});
      expect(result).toBe(true);
    });

    it('should handle deletion errors', async () => {
      // Arrange
      const error = new Error('Deletion failed');
      (mockPrisma.satuSehatConfig.deleteMany as jest.MockedFunction<any>).mockRejectedValue(error);

      // Act & Assert
      await expect(SatuSehatConfigService.deleteConfig()).rejects.toThrow('Gagal menghapus konfigurasi Satu Sehat');
    });
  });
});