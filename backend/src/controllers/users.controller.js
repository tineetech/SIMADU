import { prisma } from "../services/db.js";
import { hashPass } from "../helpers/hashpassword.js";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
});

export class UsersController {
  async getUsers(req, res) {
    try {
      const users = await prisma.user.findMany({
        select: {
          user_id: true,
          username: true,
          first_name: true,
          last_name: true,
          avatar: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true
        }
      });
      
      res.json({ status: 200, message: 'success get data', data: users });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async getUserById(req, res) {
    try {
      const user = await prisma.user.findUnique({
        where: { user_id: parseInt(req.params.id) },
        select: {
          user_id: true,
          username: true,
          first_name: true,
          last_name: true,
          avatar: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          created_at: true,
          updated_at: true
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ status: 200, message: 'success get data', data: user });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async createUsers(req, res) {
    try {
      const { 
        username,
        first_name,
        last_name,
        email,
        phone,
        password,
        role
      } = req.body;

      const hashedPass = await hashPass(password);

      const result = await prisma.$transaction(async (prisma) => {
        // Create user
        const user = await prisma.user.create({
          data: {
            username,
            first_name,
            last_name,
            email,
            phone: phone ? BigInt(phone) : null,
            password: hashedPass,
            role: role || 'guest'
          }
        });

        // Create koin entry
        await prisma.koin.create({
          data: {
            user_id: user.user_id,
            amount: 0
          }
        });

        return user;
      });

      res.json({
        status: 200,
        message: 'Berhasil membuat user dan koin!',
        data: {
          user_id: result.user_id,
          username: result.username,
          email: result.email,
          role: result.role,
          koin: 0
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async updateUsersPublic(req, res) {
    try {
      const { username, firstName, last_name, avatar, phone } = req.body;
      
      const user = await prisma.user.update({
        where: { user_id: parseInt(req.params.id) },
        data: {
          username,
          first_name: firstName,
          last_name,
          avatar,
          phone: phone ? BigInt(phone) : null
        },
        select: {
          user_id: true,
          username: true,
          first_name: true,
          last_name: true,
          avatar: true,
          phone: true
        }
      });

      res.json({ status: 200, message: 'success update data', data: user });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "User not found" });
      }
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async deleteUsers(req, res) {
    try {
      await prisma.user.delete({
        where: { user_id: parseInt(req.params.id) }
      });

      res.json({ status: 200, message: 'success remove user' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "User not found" });
      }
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async getKoins(req, res) {
    try {
      const koins = await prisma.koin.findMany();
      res.json({ status: 200, message: 'success get data', data: koins });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async getKoinById(req, res) {
    try {
      const koin = await prisma.koin.findUnique({
        where: { id: parseInt(req.params.id) }
      });

      if (!koin) {
        return res.status(404).json({ message: 'Koin not found' });
      }

      res.json({ status: 200, message: 'success get data', data: koin });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async createKoin(req, res) {
    try {
      const { user_id, amount } = req.body;

      const koin = await prisma.koin.create({
        data: {
          user_id,
          amount
        }
      });

      res.json({
        status: 200,
        message: 'Berhasil membuat koin!',
        data: koin
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }
  
  async getTrxKoin(req, res) {
    try {
      const transactions = await prisma.transactionKoin.findMany({
        include: {
          User: {
            select: {
              username: true,
              email: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      if (transactions.length === 0) {
        return res.status(404).json({ 
          message: 'No transaction data found',
          suggestion: 'Check if transaction_koin table has records'
        });
      }

      res.status(200).json({ 
        status: 200, 
        message: 'Success get data', 
        data: transactions 
      });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ 
        error: "Internal server error",
        details: error.message 
      });
    }
  }

  async createTrxKoin(req, res) {
    try {
      const { user_id, coin, number_target, method_target, amount } = req.body;
      
      if (amount % 1000 !== 0) {
        return res.status(400).json({ message: "Nilai jumlah penukaran harus berupa kelipatan ribuan (1000)" });
      }

      const result = await prisma.$transaction(async (prisma) => {
        // Create transaction
        const transaction = await prisma.transactionKoin.create({
          data: {
            user_id,
            target: number_target,
            method_target,
            amount,
            status: 'pending'
          }
        });

        // Update koin
        const downCoin = coin - amount;
        await prisma.koin.update({
          where: { user_id },
          data: { amount: downCoin }
        });

        return transaction;
      });

      res.json({
        status: 200,
        message: 'Berhasil membuat penukaran!',
        data: {
          user_id,
          number_target: result.target,
          method_target: result.method_target,
          amount: result.amount,
        }
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async updateKoin(req, res) {
    try {
      const { amount } = req.body;

      // Get current amount
      const current = await prisma.koin.findUnique({
        where: { user_id: parseInt(req.params.id) }
      });

      if (!current) {
        return res.status(404).json({ message: "Koin not found" });
      }

      const newAmount = current.amount + amount;
      
      // Update koin
      const updatedKoin = await prisma.koin.update({
        where: { user_id: parseInt(req.params.id) },
        data: { amount: newAmount }
      });

      res.status(200).json({ message: 'success update data', data: updatedKoin });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }

  async deleteKoin(req, res) {
    try {
      await prisma.koin.delete({
        where: { user_id: parseInt(req.params.id) }
      });

      res.status(200).json({ message: 'success remove koin' });
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({ message: "Koin not found" });
      }
      const message = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ error: message });
    }
  }
}