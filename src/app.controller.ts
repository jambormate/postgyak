import { Body, Controller, Get, Post, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { RendelesekDto } from './rendelesek.dto.js';
import { error } from 'console';

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
  rendelesek(@Body() body: RendelesekDto){
    const taxingTitleRegex = /^[\p{L}\s.-]+\s*\d{4}\s*[\p{L}\s.-]+(?:\s+\d+[A-Za-z]?\.?)$/gmu;
    if(!taxingTitleRegex.test(body.taxingTitle)){
      return{
        error: "Nem megfelelő számlázási cím"
      }
    }
    if(!taxingTitleRegex.test(body.deliverTitle)){
      return{
        error: "Nem megfelelő szállítási cím"
      }
    }
    const phoneNumberRegex = /^[+]{1}[36]{2}[0-9]{9}$/gmu;
    if(!phoneNumberRegex.test(body.phoneNumber)){
      return{
        error: "Nem megfelelő telefonszám"
      }
    }
    const couponCodeRegex = /^[A-Z]{2}-[0-9]{4}$/gmu;
    if(!couponCodeRegex.test(body.couponCode)){
      return{
        error: "Nem megfelelő kuponkód"
      }
    }
    const bankCardNumberRegex = /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/gmu;
    if(!bankCardNumberRegex.test(body.bankCardNumber)){
      return{
        error: "Nem megfelelő kártyaszám"
      }
    }
    const expDateRegex = /^[0-9]{2}\/[0-9]{2}$/gmu;
    if(!expDateRegex.test(body.expDate)){
      return{
        error: "Nem megfelelő lejárati dátum"
      }
    }
    const secCodeRegex = /^[0-9]{3}$/gmu;
    if(!secCodeRegex.test(body.secCode)){
      return{
        error: "Nem megfelelő biztonsági kód"
      }
    }
  }
}
