import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { RendelesekDto } from './rendelesek.dto.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'My First NestJS App'
    }
  }

  @Post('/')
  @Render('index')
  async rendelesek(@Body() body: RendelesekDto) {
    const formData = {
      product: body.product,
      name: body.name,
      billingCity: body.billingCity,
      billingZip: body.billingZip,
      billingStreet: body.billingStreet,
      deliveryCity: body.deliveryCity,
      deliveryZip: body.deliveryZip,
      deliveryStreet: body.deliveryStreet,
      phoneNumber: body.phoneNumber,
      couponCode: body.couponCode
    };

    const products = ['Fridge', 'HairDryer', 'VacuumCleaner'];
    if (!products.includes(body.product)) {
      return { error: 'Válassz egy terméket!', formData };
    }

    if (!body.name || body.name.trim().length === 0) {
      return { error: 'A név megadása kötelező!', formData };
    }

    const cityRegex = /^[\p{L}\s.-]+$/u;
    const zipRegex = /^\d{4}$/;
    const streetRegex = /^[\p{L}\d\s.-]+$/u;

    if (!cityRegex.test(body.billingCity) ||
      !zipRegex.test(body.billingZip) ||
      !streetRegex.test(body.billingStreet)) {
      return { error: 'Nem megfelelő számlázási cím!', formData };
    }

    if (!cityRegex.test(body.deliveryCity) ||
      !zipRegex.test(body.deliveryZip) ||
      !streetRegex.test(body.deliveryStreet)) {
      return { error: 'Nem megfelelő szállítási cím!', formData };
    }

    const phoneNumberRegex = /^\+36\d{9}$/;
    if (!phoneNumberRegex.test(body.phoneNumber)) {
      return { error: 'Nem megfelelő telefonszám! Példa: +36301234567', formData };
    }

    const couponCodeRegex = /^[A-Z]{2}-\d{4}$/;
    if (body.couponCode && !couponCodeRegex.test(body.couponCode)) {
      return { error: 'Nem megfelelő kuponkód!', formData };
    }

    const bankCardNumberRegex = /^\d{4}-\d{4}-\d{4}-\d{4}$/;
    if (!bankCardNumberRegex.test(body.bankCardNumber)) {
      return { error: 'Nem megfelelő bankkártyaszám!', formData };
    }

    const expDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!expDateRegex.test(body.expDate)) {
      return { error: 'Nem megfelelő lejárati dátum!', formData };
    }

    const secCodeRegex = /^\d{3}$/;
    if (!secCodeRegex.test(body.secCode)) {
      return { error: 'Nem megfelelő biztonsági kód!', formData };
    }

    const billingAddress = `${body.billingCity}, ${body.billingZip}, ${body.billingStreet}`;
    const shippingAddress = `${body.deliveryCity}, ${body.deliveryZip}, ${body.deliveryStreet}`;

    try {
      await this.appService.createOrder(
        body.product,
        body.name,
        billingAddress,
        shippingAddress
      );
      return {
        success: true,
        formData: {}
      };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);

      console.error('Adatbázis mentési hiba:', error);

      return {
        error: `Hiba történt a rendelés mentésekor: ${errorMessage}`,
        formData
      };
    }
  }
}