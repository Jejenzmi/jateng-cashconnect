import { Request, Response } from 'express';
import { prisma } from '../config/database.js';

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        attendances: true,
        payrolls: true
      }
    });
    res.json({ data: employees });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
};

export const getEmployeeById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: {
        attendances: true,
        payrolls: true
      }
    });

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ data: employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  try {
    const {
      employeeNumber,
      fullName,
      position,
      department,
      joinDate,
      employmentStatus,
      salaryGrade,
      bankAccount,
      npwp,
      bpjsKetenagakerjaan,
      bpjsKesehatan,
      photoUrl,
      salary
    } = req.body;

    const employee = await prisma.employee.create({
      data: {
        employeeNumber,
        fullName,
        position,
        department,
        joinDate: new Date(joinDate),
        employmentStatus,
        salaryGrade,
        bankAccount,
        npwp,
        bpjsKetenagakerjaan,
        bpjsKesehatan,
        photoUrl,
        salary: salary ? parseFloat(salary) : null
      }
    });

    res.status(201).json({ data: employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create employee' });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      employeeNumber,
      fullName,
      position,
      department,
      joinDate,
      employmentStatus,
      salaryGrade,
      bankAccount,
      npwp,
      bpjsKetenagakerjaan,
      bpjsKesehatan,
      photoUrl,
      salary
    } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        employeeNumber,
        fullName,
        position,
        department,
        joinDate: new Date(joinDate),
        employmentStatus,
        salaryGrade,
        bankAccount,
        npwp,
        bpjsKetenagakerjaan,
        bpjsKesehatan,
        photoUrl,
        salary: salary ? parseFloat(salary) : null
      }
    });

    res.json({ data: employee });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update employee' });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.employee.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete employee' });
  }
};

// Payroll functions
export const getAllPayrolls = async (req: Request, res: Response) => {
  try {
    const payrolls = await prisma.payroll.findMany({
      include: {
        employee: true
      }
    });
    res.json({ data: payrolls });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payrolls' });
  }
};

export const getPayrollById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const payroll = await prisma.payroll.findUnique({
      where: { id },
      include: {
        employee: true
      }
    });

    if (!payroll) {
      return res.status(404).json({ error: 'Payroll not found' });
    }

    res.json({ data: payroll });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch payroll' });
  }
};

export const createPayroll = async (req: Request, res: Response) => {
  try {
    const {
      employeeId,
      period,
      basicSalary,
      allowances,
      deductions,
      netSalary,
      status
    } = req.body;

    const payroll = await prisma.payroll.create({
      data: {
        employeeId,
        period,
        basicSalary: parseFloat(basicSalary),
        allowances,
        deductions,
        netSalary: parseFloat(netSalary),
        status
      }
    });

    res.status(201).json({ data: payroll });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create payroll' });
  }
};

// Attendance functions
export const getAllAttendances = async (req: Request, res: Response) => {
  try {
    const attendances = await prisma.attendance.findMany({
      include: {
        employee: true
      }
    });
    res.json({ data: attendances });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendances' });
  }
};

export const getAttendanceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const attendance = await prisma.attendance.findUnique({
      where: { id },
      include: {
        employee: true
      }
    });

    if (!attendance) {
      return res.status(404).json({ error: 'Attendance not found' });
    }

    res.json({ data: attendance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch attendance' });
  }
};