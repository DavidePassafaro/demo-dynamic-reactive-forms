import { Component, Input } from '@angular/core';
import { IconDefinition, faBars } from '@fortawesome/free-solid-svg-icons';
import { NgClass } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import { NavigationPage } from '../../models';

@Component({
  selector: 'drf-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [NgClass, RouterModule, FontAwesomeModule],
})
export class HeaderComponent {
  @Input() public pages: NavigationPage[];

  public isMobileMenuOpen: boolean;

  public readonly faBars: IconDefinition = faBars;

  public mobileMenuSwitch(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public mobileMenuClose(): void {
    this.isMobileMenuOpen = false;
  }
}
