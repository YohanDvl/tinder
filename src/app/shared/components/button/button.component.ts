import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  standalone: false,
})
export class ButtonComponent implements OnInit {
  @Input() type: string = '';
  @Input() color: string = 'primary';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Output() clicked = new EventEmitter<Event>();

  constructor() {}

  ngOnInit() {}
}
