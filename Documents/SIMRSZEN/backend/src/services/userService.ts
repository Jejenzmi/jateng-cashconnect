import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';

interface UserFilters {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc' | undefined;
  searchQuery?: string;
}

interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserInput {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  isActive?: boolean;
}

export class UserService {
  // Hash password utility
  private static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  // Compare password utility
  static async comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(inputPassword, hashedPassword);
  }

  // Get all users with pagination and filtering
  static async getAll(filters: UserFilters = {}) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const offset = (page - 1) * limit;
    
    // Determine sort field and direction
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';
    
    // Build where clause for search
    let whereClause: Prisma.UserWhereInput = {};
    
    if (filters.searchQuery) {
      whereClause.OR = [
        {
          username: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: filters.searchQuery,
            mode: 'insensitive',
          },
        },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      skip: offset,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password hash for security
      },
    });

    const total = await prisma.user.count({
      where: whereClause
    });

    return {
      data: users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalRecords: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  // Get user by ID
  static async getById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password hash for security
      },
    });

    return user;
  }

  // Get user by email for login
  static async getByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  // Create a new user
  static async create(data: CreateUserInput) {
    // Check if user with same email or username already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ],
      },
    });

    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const hashedPassword = await this.hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Update user
  static async update(id: string, data: UpdateUserInput) {
    // If password is being updated, hash it
    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password hash for security
      },
    });

    return user;
  }

  // Delete user
  static async delete(id: string) {
    const user = await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        // Don't return password hash for security
      },
    });

    return user;
  }

  // Toggle user active status
  static async toggleActive(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        isActive: !user.isActive,
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}