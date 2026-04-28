import { Request, Response, NextFunction } from 'express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'SIMRS ZEN API Documentation',
    version: '1.0.0',
    description: 'API documentation for SIMRS ZEN - Hospital Information System',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
    {
      url: 'https://simrszen.example.com/api',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Shift: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique identifier for the shift',
            example: 'shift_123',
          },
          name: {
            type: 'string',
            description: 'Name of the shift',
            example: 'Morning Shift',
          },
          description: {
            type: 'string',
            description: 'Description of the shift',
            example: 'Morning shift for nursing staff',
          },
          startTime: {
            type: 'string',
            format: 'date-time',
            description: 'Start time of the shift',
            example: '2023-01-01T08:00:00Z',
          },
          endTime: {
            type: 'string',
            format: 'date-time',
            description: 'End time of the shift',
            example: '2023-01-01T16:00:00Z',
          },
          breakStartTime: {
            type: 'string',
            format: 'date-time',
            description: 'Start time of break period (optional)',
            example: '2023-01-01T12:00:00Z',
          },
          breakEndTime: {
            type: 'string',
            format: 'date-time',
            description: 'End time of break period (optional)',
            example: '2023-01-01T13:00:00Z',
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the shift is currently active',
            example: true,
          },
          isOvertimeAllowed: {
            type: 'boolean',
            description: 'Whether overtime is allowed for this shift',
            example: false,
          },
          maxConsecutiveDays: {
            type: 'number',
            description: 'Maximum consecutive days an employee can work this shift',
            example: 5,
          },
          minRestHoursAfterShift: {
            type: 'number',
            description: 'Minimum rest hours required after this shift',
            example: 10,
          },
          weekendPattern: {
            type: 'string',
            enum: ['off', 'half', 'full'],
            description: 'Weekend pattern for this shift: off (no work), half (partial work), full (full work)',
            example: 'off',
          },
          holidayWorking: {
            type: 'boolean',
            description: 'Whether working on holidays is allowed/required for this shift',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the shift was created',
            example: '2023-01-01T00:00:00Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp when the shift was last updated',
            example: '2023-01-01T00:00:00Z',
          },
        },
      },
      // ... existing schemas ...
    },
  },
  paths: {
    '/shift': {
      get: {
        summary: 'Get all shifts',
        description: 'Retrieve a list of all shifts in the system',
        responses: {
          200: {
            description: 'List of shifts',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Successfully retrieved all shifts',
                    },
                    data: {
                      type: 'array',
                      items: {
                        $ref: '#/components/schemas/Shift',
                      },
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
      post: {
        summary: 'Create a new shift',
        description: 'Create a new shift with the provided details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'startTime', 'endTime'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name of the shift',
                    example: 'Night Shift',
                  },
                  description: {
                    type: 'string',
                    description: 'Description of the shift',
                    example: 'Overnight shift for nursing staff',
                  },
                  startTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start time of the shift',
                    example: '2023-01-01T20:00:00Z',
                  },
                  endTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'End time of the shift',
                    example: '2023-01-01T08:00:00Z',
                  },
                  breakStartTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Start time of break period (optional)',
                    example: '2023-01-01T02:00:00Z',
                  },
                  breakEndTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'End time of break period (optional)',
                    example: '2023-01-01T03:00:00Z',
                  },
                  isActive: {
                    type: 'boolean',
                    description: 'Whether the shift is currently active',
                    example: true,
                  },
                  isOvertimeAllowed: {
                    type: 'boolean',
                    description: 'Whether overtime is allowed for this shift',
                    example: false,
                  },
                  maxConsecutiveDays: {
                    type: 'number',
                    description: 'Maximum consecutive days an employee can work this shift',
                    example: 5,
                  },
                  minRestHoursAfterShift: {
                    type: 'number',
                    description: 'Minimum rest hours required after this shift',
                    example: 10,
                  },
                  weekendPattern: {
                    type: 'string',
                    enum: ['off', 'half', 'full'],
                    description: 'Weekend pattern for this shift',
                    example: 'off',
                  },
                  holidayWorking: {
                    type: 'boolean',
                    description: 'Whether working on holidays is allowed/required for this shift',
                    example: false,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Shift created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Shift created successfully',
                    },
                    data: {
                      $ref: '#/components/schemas/Shift',
                    },
                  },
                },
              },
            },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    '/shift/{id}': {
      get: {
        summary: 'Get a shift by ID',
        description: 'Retrieve details of a specific shift by its ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the shift to retrieve',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Details of the shift',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Successfully retrieved shift',
                    },
                    data: {
                      $ref: '#/components/schemas/Shift',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Shift not found',
          },
        },
        security: [{ bearerAuth: [] }],
      },
      put: {
        summary: 'Update a shift',
        description: 'Update details of an existing shift',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the shift to update',
            schema: {
              type: 'string',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Updated name of the shift',
                    example: 'Updated Night Shift',
                  },
                  description: {
                    type: 'string',
                    description: 'Updated description of the shift',
                    example: 'Updated overnight shift for nursing staff',
                  },
                  startTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Updated start time of the shift',
                    example: '2023-01-01T20:00:00Z',
                  },
                  endTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Updated end time of the shift',
                    example: '2023-01-01T08:00:00Z',
                  },
                  breakStartTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Updated start time of break period (optional)',
                    example: '2023-01-01T02:00:00Z',
                  },
                  breakEndTime: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Updated end time of break period (optional)',
                    example: '2023-01-01T03:00:00Z',
                  },
                  isActive: {
                    type: 'boolean',
                    description: 'Whether the shift is currently active',
                    example: true,
                  },
                  isOvertimeAllowed: {
                    type: 'boolean',
                    description: 'Whether overtime is allowed for this shift',
                    example: false,
                  },
                  maxConsecutiveDays: {
                    type: 'number',
                    description: 'Maximum consecutive days an employee can work this shift',
                    example: 5,
                  },
                  minRestHoursAfterShift: {
                    type: 'number',
                    description: 'Minimum rest hours required after this shift',
                    example: 10,
                  },
                  weekendPattern: {
                    type: 'string',
                    enum: ['off', 'half', 'full'],
                    description: 'Weekend pattern for this shift',
                    example: 'off',
                  },
                  holidayWorking: {
                    type: 'boolean',
                    description: 'Whether working on holidays is allowed/required for this shift',
                    example: false,
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Shift updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Shift updated successfully',
                    },
                    data: {
                      $ref: '#/components/schemas/Shift',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Shift not found',
          },
        },
        security: [{ bearerAuth: [] }],
      },
      delete: {
        summary: 'Delete a shift',
        description: 'Remove a shift from the system',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID of the shift to delete',
            schema: {
              type: 'string',
            },
          },
        ],
        responses: {
          200: {
            description: 'Shift deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: {
                      type: 'boolean',
                      example: true,
                    },
                    message: {
                      type: 'string',
                      example: 'Shift deleted successfully',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Shift not found',
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    // ... existing paths ...
  },
};

export function swaggerDocs(app: { use: (arg0: string, arg1: any) => void }) {
  // Middleware to handle the /api-docs route
  app.use('/api-docs', (req: Request, res: Response, next: NextFunction) => {
    // Set CORS headers
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });
}