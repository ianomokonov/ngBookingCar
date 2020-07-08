import { Car } from './car';

export interface Feedback{
    id: number;
    userName: string;
    raiting: number;
    car: Car;
    message: string;
    date: Date;
}