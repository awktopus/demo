import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { OrgUnit } from '../../model/orgunit.model';
const defaultColors = ['#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#b91d47']
/**
 * Generated class for the OrgAvatarComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'org-avatar',
  templateUrl: 'org-avatar.html',
  styleUrls: ['./org-avatar.scss']
})


export class OrgAvatarComponent implements OnInit, OnChanges {
  @Input() set name(name: string) {
    this._name = name;
  }
  @Input() set imageUrl(imageUrl: string) {
    this._imageUrl = imageUrl;
  }
  _imageUrl: string;
  _name: string;
  _initials: string;
  avatarColors: string[] = defaultColors;
  bgColor: string;
  fontColor: string;
  _default: string;
  constructor() {
    console.log('Hello OrgAvatarComponent Component');
  }

  ngOnInit() {
    this.prepareAvatar();
    this._default = OrgUnit.ORG_AVATAR_DEFAULT;
  }

  ngOnChanges() {
    this.prepareAvatar();
  }

  prepareAvatar() {
    if (this._name && this._name.length) {
      this.getAvatarColor();
      const nameInitials = this._name.match(/\b(\w)/g);
      if (nameInitials) {
        const nameLetters = nameInitials.slice(0, 2).join('');
        this._initials = nameLetters.toUpperCase();
      } else {
        this._initials = this._name[0];
      }
    }
  }

  private getAvatarColor() {
    if (this._name) {
      let avatarText = this._name;
      if (!avatarText) {
        this.bgColor = "transparent";
      }
      const asciiCodeSum = this.calculateAsciiCode(avatarText);
      let index = asciiCodeSum % this.avatarColors.length;
      if (index) {
        this.bgColor = this.avatarColors[index];
      } else {
        this.bgColor = this.avatarColors[0];
      }
    }
    this.setFontColor(this.bgColor);

  }

  private calculateAsciiCode(value: string): number {
    return value
      .split("")
      .map(letter => letter.charCodeAt(0))
      .reduce((previous, current) => previous + current);
  }

  private setFontColor(hex: string) {
    if (hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

      var r = parseInt(result[1], 16);
      var g = parseInt(result[2], 16);
      var b = parseInt(result[3], 16);

      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;


      l = l * 100;
      l = Math.round(l);

      if (l > 50) {
        this.fontColor = "#000000";
      } else {
        this.fontColor = "#ffffff";
      }
    }
  }
}
