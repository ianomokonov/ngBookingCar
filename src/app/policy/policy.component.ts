import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'bk-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit {
  items = [
    {
      name: {
        ru: 'Платите за конкретный автомобиль, а не за случайный из категории',
        en: 'Book specific car, not category',
        de: 'Buchen Sie ein bestimmtes Auto, keine Kategorie.',
      },
      description: {
        ru: 'Какую машину Вы забронировали - такую мы Вам и выдадим по прибытии',
        en: 'What car model you choose - you will take on arrival',
        de: 'Welches Auto Sie auf dem Foto sehen - das erhalten Sie bei der Ankunft auf Kreta.',
      },
    },
    {
      name: { ru: 'Никаких предоплат', en: 'No Prepayment on site', de: 'Keine Vorauszahlung auf der Website' },
      description: {
        ru: 'Бронирование бесплатно и предоплата на сайте не требуется. Оплата осуществляется после подписания договора. Мы принимаем к оплате как наличные, так и кредитные карты Visa / Master Card',
        en: 'Reservation is free and no prepayment on the website is necessary. The payment is carried out after the contract is signed. We accept payments with cash, Visa/Master credit cards',
        de: 'Die Reservierung ist kostenlos und es ist keine Vorauszahlung auf der Website erforderlich. Die Zahlung erfolgt nach Vertragsabschluss. Wir akzeptieren Zahlungen mit Bargeld, Visa/Master-Kreditkarten.',
      },
    },
    {
      name: { ru: 'Бесплатная отмена бронирования', en: 'Free Cancellation', de: 'Kostenfreie Stornierung' },
      description: {
        ru: 'Поскольку мы не берем предоплату за бронирование автомобиля, пожалуйста, сообщите нам об отмене бронирования за 5 дней до даты Вашего прибытия. Средства за неиспользованные дни аренды возврату не подлежат',
        en: 'Because we do not take any deposit for booking car, be responsible to tell us for cancellation 5 days before arrival date. Funds for unused rental days are non-refundable',
        de: 'Da wir keine Anzahlung für die Buchung eines Autos verlangen, müssen Sie uns 5 Tage vor dem Ankunftsdatum über die Stornierung informieren. Guthaben für ungenutzte Miettage sind nicht erstattungsfähig',
      },
    },
    {
      name: { ru: 'Единая стоимость без доплат', en: 'Final price & NO Extra payment', de: 'Alle Preise sind Endpreise' },
      description: {
        ru: 'Вы видите окончательную цену проката автомобиля нашей компании. Никаких скрытых налогов и дополнительных страховок. Наши цены включают 24% НДС, полную страховку, неограниченный пробег, круглосуточную помощь на дороге по всему Криту',
        en: 'You see the FINAL car rental price with our company. No hidden taxes and extra insuranses. Our rates include 24% VAT, Full Insurance, unlimited Mileage, 24 hours road Assistance all over Crete',
        de: 'Mietwagen auf Kreta mit Car4Crete - Preisgarantie. Inklusive 24 % MwSt., Versicherung, unbegrenzte Kilometer, 24-Stunden Pannenhilfe',
      },
    },
    {
      name: { ru: 'Полная страховка без излишеств', en: 'Included insurances', de: 'Inklusive Versicherungen' },
      description: {
        ru: 'КАСКО с полным покрытием (FCDW)<br>Страхование от несчастных случаев (PAI)<br>Страховка на случай кражи или пожара<br>Полис ОСАГО (LI)',
        en: 'Collision Damage Waiver (CDW)<br>Personal accident insurance (PAI)<br>Theft & Fire insurance<br>Liability Insurance (LI)',
        de: 'Haftungsbeschränkung für Schäden am Mietfahrzeug (CDW)<br>Insassen-Unfallversicherung (PAI)<br>Diebstahlversicherung (TP)<br>Haftpflichtdeckung (LI)',
      },
    },
  ];

  conditions = [
    {
      img: '../../assets/images/icons/taxi.svg',
      name: { ru: 'Неограниченный пробег', en: 'Unlimited Mileage' },
      description: { ru: 'Никаких наценок за пройденный километраж', en: 'No extra charge for kilometers driven' },
    },
    {
      img: '../../assets/images/icons/map.svg',
      name: { ru: 'Подробная карта Крита', en: 'Detailed Crete map' },
      description: {
        ru: 'Карта Крита поставляется с каждым арендованным автомобилем бесплатно. За систему GPS необходимо доплачивать 5 евро в день',
        en: 'Crete Map comes with each rental car for free. GPS will cost 5 euros per day',
      },
    },
    {
      img: '../../assets/images/icons/baby-car-seat.svg',
      name: { ru: 'Детское кресло или бустер', en: 'Child / Baby Seat' },
      description: {
        ru: 'Одно детское кресло или бустер бесплатно. Дополнительные кресла/бустеры обойдутся в 2 евро в день',
        en: 'One child seat or booster for free. Additional seats will cost 2 euros a day each',
      },
    },
    {
      img: '../../assets/images/icons/biofuel.svg',
      name: { ru: 'Топливная политика', en: 'Fuel policy' },
      description: {
        ru: 'Вы выбираете одно из двух решений. Либо Вы возвращаете автомобиль с тем же количеством топлива, с которым получили. Либо за дополнительную плату мы можем привезти автомобиль с полным баком, а вы возвращаете его пустым',
        en: 'There are two possibilities. 1 You return the car with the same amount of fuel as received. 2 For an additional fee, we can bring a car with a full tank, you return it empty',
      },
    },
    {
      img: '../../assets/images/icons/driver.svg',
      name: { ru: 'Второй водитель', en: 'Additional Drivers' },
      description: { ru: 'Вы можете вписать в договор помимо себя ещё одного водителя бесплатно', en: 'Additional driver free of charge' },
    },
    {
      img: '../../assets/images/icons/payment.svg',
      name: { ru: 'Никаких дополнительных сборов за задержку рейса', en: 'No additional charges on flight delays' },
      description: {
        ru: 'Мы не взимаем штрафы за задержку Вашего рейста, так как обычно мы отслеживаем прибытие самолета онлайн, и, в случае задержки, доставляем автомобиль к измененному времени',
        en: 'Be sure that we will wait for your arrival even if the plane is delayed at no extra charge. Usually we monitor the arrival of the aircraft online',
      },
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}
