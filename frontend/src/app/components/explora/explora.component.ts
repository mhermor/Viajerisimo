import { Component } from '@angular/core';

@Component({
  selector: 'app-explora',
  imports: [],
  templateUrl: './explora.component.html',
  styleUrl: './explora.component.css'
})
export class ExploraComponent {
  activeCategory = 'playa';

  public setCategory(categoria: string): void {
    this.activeCategory = categoria;
  }

  public isVisible(categoria: string): boolean {
    return this.activeCategory === categoria;
  }
}
