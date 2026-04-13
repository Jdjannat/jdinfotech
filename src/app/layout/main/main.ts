import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet,Footer,Navbar],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
