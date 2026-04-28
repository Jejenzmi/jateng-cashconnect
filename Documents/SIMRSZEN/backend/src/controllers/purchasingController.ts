import { Request, Response } from 'express';
import { prisma } from '../config/database.js';

export const getAllSuppliers = async (req: Request, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany();
    res.json({ data: suppliers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
};

export const getSupplierById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplier = await prisma.supplier.findUnique({
      where: { id }
    });

    if (!supplier) {
      return res.status(404).json({ error: 'Supplier not found' });
    }

    res.json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
};

export const createSupplier = async (req: Request, res: Response) => {
  try {
    const {
      name,
      contactPerson,
      phone,
      email,
      address,
      bankAccount,
      taxId,
      isActive
    } = req.body;

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactPerson,
        phone,
        email,
        address,
        bankAccount,
        taxId,
        isActive: isActive !== undefined ? isActive : true
      }
    });

    res.status(201).json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create supplier' });
  }
};

export const updateSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      contactPerson,
      phone,
      email,
      address,
      bankAccount,
      taxId,
      isActive
    } = req.body;

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        name,
        contactPerson,
        phone,
        email,
        address,
        bankAccount,
        taxId,
        isActive
      }
    });

    res.json({ data: supplier });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update supplier' });
  }
};

export const deleteSupplier = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
};

// Purchase Request functions
export const getAllPurchaseRequests = async (req: Request, res: Response) => {
  try {
    const purchaseRequests = await prisma.purchaseRequest.findMany({
      include: {
        department: true,
        requestedBy: {
          select: {
            fullName: true
          }
        },
        items: true
      }
    });
    res.json({ data: purchaseRequests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase requests' });
  }
};

export const getPurchaseRequestById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        department: true,
        requestedBy: {
          select: {
            fullName: true
          }
        },
        approvedBy: {
          select: {
            fullName: true
          }
        },
        items: true
      }
    });

    if (!purchaseRequest) {
      return res.status(404).json({ error: 'Purchase request not found' });
    }

    res.json({ data: purchaseRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase request' });
  }
};

export const createPurchaseRequest = async (req: Request, res: Response) => {
  try {
    const {
      prNumber,
      departmentId,
      requestedById,
      requestDate,
      dueDate,
      notes,
      items
    } = req.body;

    const purchaseRequest = await prisma.purchaseRequest.create({
      data: {
        prNumber,
        departmentId,
        requestedById,
        requestDate: new Date(requestDate),
        dueDate: new Date(dueDate),
        notes,
        status: 'draft',
        items: {
          create: items.map((item: any) => ({
            itemName: item.itemName,
            itemDescription: item.itemDescription,
            quantity: item.quantity,
            unit: item.unit,
            estimatedPrice: parseFloat(item.estimatedPrice),
            totalAmount: parseFloat(item.totalAmount),
            priority: item.priority
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({ data: purchaseRequest });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase request' });
  }
};

export const updatePurchaseRequestStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, approvedById } = req.body;

    const updatedPR = await prisma.purchaseRequest.update({
      where: { id },
      data: {
        status,
        approvedById,
        approvedAt: status === 'approved' ? new Date() : undefined
      }
    });

    res.json({ data: updatedPR });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update purchase request status' });
  }
};

// Purchase Order functions
export const getAllPurchaseOrders = async (req: Request, res: Response) => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        supplier: true,
        items: {
          include: {
            medicine: true
          }
        }
      }
    });
    res.json({ data: purchaseOrders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
};

export const getPurchaseOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        supplier: true,
        items: {
          include: {
            medicine: true
          }
        }
      }
    });

    if (!purchaseOrder) {
      return res.status(404).json({ error: 'Purchase order not found' });
    }

    res.json({ data: purchaseOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch purchase order' });
  }
};

export const createPurchaseOrder = async (req: Request, res: Response) => {
  try {
    const {
      orderNumber,
      supplierId,
      orderDate,
      expectedDelivery,
      items,
      subtotal,
      taxAmount,
      total
    } = req.body;

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        orderNumber,
        supplierId,
        orderDate: new Date(orderDate),
        expectedDelivery: expectedDelivery ? new Date(expectedDelivery) : null,
        subtotal: parseFloat(subtotal),
        taxAmount: parseFloat(taxAmount),
        total: parseFloat(total),
        status: 'ordered',
        items: {
          create: items.map((item: any) => ({
            medicineId: item.medicineId,
            quantity: item.quantity,
            unitPrice: parseFloat(item.unitPrice),
            totalPrice: parseFloat(item.totalPrice)
          }))
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json({ data: purchaseOrder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create purchase order' });
  }
};