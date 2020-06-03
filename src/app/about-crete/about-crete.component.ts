import { Component, OnInit } from '@angular/core';
import { PlaceOfInterest } from '../models/place-of-interest';

@Component({
  selector: 'bk-about-crete',
  templateUrl: './about-crete.component.html',
  styleUrls: ['./about-crete.component.scss'],
})
export class AboutCreteComponent implements OnInit {
  public rating = 3.5;
  public placesOfInterest: PlaceOfInterest[] = [{
    id: 1,
    img: '../../assets/lake.jpg',
    name: {
      ru: 'Озеро Курна',
      en: 'Kournas lake'
    },
    description: {
      ru: ' Главная достопримечательность Крита изумляет восхитительным пейзажем, который расслабляет и умиротворяет. В какое время года вы бы ни приехали, озеро Курна одинаково прекрасно, и даже зимой можно наслаждаться чудесными видами покрытых снегом величественных гор, отражающихся в прозрачных водаx. Вас ждет оборудованный пляж с шезлонгами и зонтиками, кабинками для переодевания. Поражает разнообразие покачивающихся на волнах катамаранов. Они представлены в нескольких модификациях: двух- и четырехместные, стилизованные под ретромобили и конструкции с горкой, откуда так приятно скатиться в теплую воду. На некоторых суднах имеется навес, защищающий от солнечных лучей. Многие туристы отправляются подальше от людских глаз, чтобы побыть наедине друг с другом и вволю поплавать, поскольку рядом с берегом сделать это сложно из-за большого количества отдыхающих.',
      en: 'The main attraction of Crete is the breathtaking scenery that relaxes and appeases. No matter what time of year you come, lake Kurna is equally beautiful, and even in winter you can enjoy the wonderful views of the snow-covered majestic mountains reflected in the clear waters.'
    },
    road: {
      ru: "Ехать придется на восток по трассе Е75, и через 40 километров покажется небольшой городок Георгиуполи, рядом с которым находится достопримечательность.",
      en: "It is necessary to go to the East on the route E75, and in 40 kilometers the small town of Georgioupolis near which there is a sight will seem."
    },
    rating: 3.5
  },
  {
    id: 1,
    img: '../../assets/lake.jpg',
    name: {
      ru: 'Озеро Курна',
      en: 'Kournas lake'
    },
    description: {
      ru: ' Главная достопримечательность Крита изумляет восхитительным пейзажем, который расслабляет и умиротворяет. В какое время года вы бы ни приехали, озеро Курна одинаково прекрасно, и даже зимой можно наслаждаться чудесными видами покрытых снегом величественных гор, отражающихся в прозрачных водаx. Вас ждет оборудованный пляж с шезлонгами и зонтиками, кабинками для переодевания. Поражает разнообразие покачивающихся на волнах катамаранов. Они представлены в нескольких модификациях: двух- и четырехместные, стилизованные под ретромобили и конструкции с горкой, откуда так приятно скатиться в теплую воду. На некоторых суднах имеется навес, защищающий от солнечных лучей. Многие туристы отправляются подальше от людских глаз, чтобы побыть наедине друг с другом и вволю поплавать, поскольку рядом с берегом сделать это сложно из-за большого количества отдыхающих.',
      en: 'The main attraction of Crete is the breathtaking scenery that relaxes and appeases. No matter what time of year you come, lake Kurna is equally beautiful, and even in winter you can enjoy the wonderful views of the snow-covered majestic mountains reflected in the clear waters.'
    },
    road: {
      ru: "Ехать придется на восток по трассе Е75, и через 40 километров покажется небольшой городок Георгиуполи, рядом с которым находится достопримечательность.",
      en: "It is necessary to go to the East on the route E75, and in 40 kilometers the small town of Georgioupolis near which there is a sight will seem."
    },
    rating: 3.5
  },
  {
    id: 1,
    img: '../../assets/lake.jpg',
    name: {
      ru: 'Озеро Курна',
      en: 'Kournas lake'
    },
    description: {
      ru: ' Главная достопримечательность Крита изумляет восхитительным пейзажем, который расслабляет и умиротворяет. В какое время года вы бы ни приехали, озеро Курна одинаково прекрасно, и даже зимой можно наслаждаться чудесными видами покрытых снегом величественных гор, отражающихся в прозрачных водаx. Вас ждет оборудованный пляж с шезлонгами и зонтиками, кабинками для переодевания. Поражает разнообразие покачивающихся на волнах катамаранов. Они представлены в нескольких модификациях: двух- и четырехместные, стилизованные под ретромобили и конструкции с горкой, откуда так приятно скатиться в теплую воду. На некоторых суднах имеется навес, защищающий от солнечных лучей. Многие туристы отправляются подальше от людских глаз, чтобы побыть наедине друг с другом и вволю поплавать, поскольку рядом с берегом сделать это сложно из-за большого количества отдыхающих.',
      en: 'The main attraction of Crete is the breathtaking scenery that relaxes and appeases. No matter what time of year you come, lake Kurna is equally beautiful, and even in winter you can enjoy the wonderful views of the snow-covered majestic mountains reflected in the clear waters.'
    },
    road: {
      ru: "Ехать придется на восток по трассе Е75, и через 40 километров покажется небольшой городок Георгиуполи, рядом с которым находится достопримечательность.",
      en: "It is necessary to go to the East on the route E75, and in 40 kilometers the small town of Georgioupolis near which there is a sight will seem."
    },
    rating: 3.5
  }];
  constructor() {}

  ngOnInit(): void {}
}
