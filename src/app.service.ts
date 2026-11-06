import { Injectable } from '@nestjs/common';
import mysql from 'mysql2/promise';

@Injectable()
export class AppService {

  private connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'webshop'
  });

  async createOrder(
    product: string,
    customerName: string,
    billingAddress: string,
    shippingAddress: string
  ) {
    await this.connection.execute(
      `INSERT INTO orders 
            (product, customerName, billingAddress, shippingAddress) 
            VALUES (?, ?, ?, ?)`,
      [product, customerName, billingAddress, shippingAddress]
    );
  }
}
