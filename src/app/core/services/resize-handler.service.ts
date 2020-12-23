import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResizeHandlerService {
  private mapElement: HTMLElement;
  private tableElement: HTMLElement;
  private defaultHeight = '30vh';
  private detailPaneWidth = 42; // vh

  constructor() {
  }

  collapseTable() {
    // resize table
    this.tableElement.style.height = '0px';
    this.tableElement.dispatchEvent(new Event('resize'));
    // resize map
    this.mapElement.style.height = `${window.innerHeight - 90}px`;
    // const mapWidth = window.innerWidth - this.vwToPx(this.detailPaneWidth);
    // this.mapElement.style.width = `${mapWidth}px`;
    // this.mapElement.style.right = '0px';
    // this.mapElement.style.left = 'auto';
    // this.mapElement.style.position = 'absolute';
    this.mapElement.dispatchEvent(new Event('resize'));
  }

  expandTable() {
    // resize table
    this.tableElement.style.height = `${this.defaultHeight}`;
    this.tableElement.dispatchEvent(new Event('resize'));
    // resize map
    const maxHeight = window.innerHeight - 219;
    const calcHeight = Number(this.tableElement.style.height);
    let newHeight = Math.max(calcHeight, 160);
    newHeight = Math.min(newHeight, maxHeight);
    this.mapElement.style.height = `${newHeight}px`;
    this.mapElement.style.width = '100vw';
    this.mapElement.style.position = 'relative';
    this.mapElement.dispatchEvent(new Event('resize'));
  }


  vwToPx(value: number) {
    const w = window;
    const d = document;
    const  e = d.documentElement;
    const  g = d.getElementsByTagName('body')[0];
    const  x = w.innerWidth || e.clientWidth || g.clientWidth;
    const  y = w.innerHeight || e.clientHeight || g.clientHeight;

    const val = (x * value) / 100;
    return Math.min(val);
  }

  registerTableElement(hostElement: HTMLElement) {
    this.tableElement = hostElement;
  }

  registerMapElement(hostElement: HTMLElement) {
    this.mapElement = hostElement;
  }


  resizeElements(mouseEvent: MouseEvent) {
      this.tableResize(mouseEvent);
      this.mapResize(mouseEvent);
  }

  mapResize(mouseEvent: MouseEvent) {
      // the map resize math is inverted from table, map needs to grow in size when table shrinks in size
      // this service should probably be refactored at some point
      const initialMouseY: number = mouseEvent.clientY;
      const initialTableHeight: number = this.mapElement.offsetHeight;
      let newHeight;
      const maxHeight = window.innerHeight - 219;

      const onmove = (moveEvent: MouseEvent) => {
        const calcHeight = initialTableHeight - initialMouseY + moveEvent.clientY;
        newHeight = Math.max(calcHeight, 160);
        newHeight = Math.min(newHeight, maxHeight);
        this.mapElement.style.height = `${newHeight}px`;
        this.mapElement.style.bottom =  this.tableElement.style.top + 'px';
        this.mapElement.dispatchEvent(new Event('resize'));
      };

      const onup = () => {
        document.removeEventListener('mousemove', onmove);
        document.removeEventListener('mouseup', onup);
        this.mapElement.dispatchEvent(new Event('resize'));
      };

      document.addEventListener('mousemove', onmove);
      document.addEventListener('mouseup', onup);
  }

  tableResize(mouseEvent: MouseEvent) {
      const initialMouseY: number = mouseEvent.clientY;
      const initialTableHeight: number = this.tableElement.offsetHeight;
      let newHeight;
      const maxHeight = window.innerHeight - 32;

      const onmove = (moveEvent: MouseEvent) => {
        newHeight = initialTableHeight + initialMouseY - moveEvent.clientY;
        newHeight = Math.max(newHeight, 160);
        newHeight = Math.min(newHeight, maxHeight);
        this.tableElement.style.height = `${newHeight}px`;
        this.tableElement.dispatchEvent(new Event('resize'));
      };

      const onup = () => {
        document.removeEventListener('mousemove', onmove);
        document.removeEventListener('mouseup', onup);
        this.tableElement.dispatchEvent(new Event('resize'));
      };

      document.addEventListener('mousemove', onmove);
      document.addEventListener('mouseup', onup);
  }

}
