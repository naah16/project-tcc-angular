import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Navigation {
  name: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  navigation: Navigation[] = [
    { name: 'Home', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Ajuda', path: '/ajuda' },
  ];

  isOpen: boolean = false;
  currentPath: string;

  constructor(private location: Location) {
    this.currentPath = this.location.path();
  }

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  handleLinkClick(event: Event, path: string): void {
    const currentPath = this.currentPath;
    if (currentPath === path) {
      event.preventDefault();
    }
  }
}
