import { Request, Response } from 'express';
import { userSchema, userUpdateSchema } from '../utils/validationSchemas';
import logger from '../utils/logger';
import { UserService } from '../services/userService';
import { ZodError } from 'zod';

// Get all users with pagination
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page, limit, sortBy, sortOrder, q } = req.query;

    const filters: {
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      searchQuery?: string;
    } = {
      page: page ? parseInt(page as string) : 1,
      limit: limit ? parseInt(limit as string) : 10,
      sortBy: sortBy as string,
      sortOrder: (sortOrder === 'asc' || sortOrder === 'desc') ? sortOrder : 'desc',
      searchQuery: q as string,
    };

    const result = await UserService.getAll(filters);

    logger.info('Successfully retrieved users', { count: result.data.length, page: filters.page });

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    logger.error('Error retrieving users', { error: (error as Error).message, stack: (error as Error).stack });
    
    res.status(500).json({
      success: false,
      message: 'Error retrieving users',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await UserService.getById(id);

    if (!user) {
      logger.warn('User not found', { id });
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    logger.info('Successfully retrieved user', { id });

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    logger.error('Error retrieving user', { error: (error as Error).message, stack: (error as Error).stack, userId: req.params.id });
    
    res.status(500).json({
      success: false,
      message: 'Error retrieving user',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = userSchema.parse(req.body);

    const newUser = await UserService.create(validatedData);

    logger.info('Successfully created user', { userId: newUser.id, username: newUser.username });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: newUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error in user creation', { error: error.message, requestBody: req.body });
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues, // Menggunakan 'issues' bukan 'errors'
      });
    }
    
    logger.error('Error creating user', { error: (error as Error).message, stack: (error as Error).stack, username: req.body.username });
    
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Update user
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = userUpdateSchema.parse(req.body);

    const { id } = req.params;
    const updatedUser = await UserService.update(id, validatedData);

    logger.info('Successfully updated user', { id, username: updatedUser.username });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      logger.warn('Validation error in user update', { error: error.message, userId: req.params.id, requestBody: req.body });
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.issues, // Menggunakan 'issues' bukan 'errors'
      });
    }
    
    logger.error('Error updating user', { error: (error as Error).message, stack: (error as Error).stack, userId: req.params.id });
    
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await UserService.delete(id);

    logger.info('Successfully deleted user', { id });

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    logger.error('Error deleting user', { error: (error as Error).message, stack: (error as Error).stack, userId: req.params.id });
    
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Toggle user active status
export const toggleUserActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedUser = await UserService.toggleActive(id);

    logger.info('Successfully toggled user status', { id, isActive: updatedUser.isActive });

    res.json({
      success: true,
      message: `User status updated to ${updatedUser.isActive ? 'active' : 'inactive'}`,
      data: updatedUser,
    });
  } catch (error) {
    logger.error('Error toggling user status', { error: (error as Error).message, stack: (error as Error).stack, userId: req.params.id });
    
    res.status(500).json({
      success: false,
      message: 'Error updating user status',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};

// Login user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const loginCredentials = req.body;
    
    // Validate inputs
    if (!loginCredentials.email || !loginCredentials.password) {
      logger.warn('Missing credentials in login attempt', { 
        emailProvided: !!loginCredentials.email, 
        passwordProvided: !!loginCredentials.password 
      });
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await UserService.getByEmail(loginCredentials.email);

    if (!user) {
      logger.warn('Login attempt with non-existent email', { email: loginCredentials.email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isValidPassword = await UserService.comparePassword(loginCredentials.password, user.password);

    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email: loginCredentials.email });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.isActive) {
      logger.warn('Login attempt for inactive account', { email: loginCredentials.email, userId: user.id });
      return res.status(401).json({
        success: false,
        message: 'Account is inactive. Contact administrator.',
      });
    }

    // Here we would normally generate a JWT token
    // For now, we'll just return the user data without password
    const { password: _, ...userWithoutPassword } = user;

    logger.info('Successful login', { userId: user.id, email: user.email });

    res.json({
      success: true,
      message: 'Login successful',
      data: userWithoutPassword,
    });
  } catch (error) {
    logger.error('Error during login', { 
      error: (error as Error).message, 
      stack: (error as Error).stack, 
      email: req.body.email 
    });
    
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined,
    });
  }
};