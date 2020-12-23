import { Component, OnInit } from '@angular/core';

import { SystemService} from 'src/app/core/services/system.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  isSystemOpen = false;
  constructor(
    private systemService: SystemService
  ) { }

  async ngOnInit() {
    this.isSystemOpen = await this.systemService.getIsSystemOpen();
  }

  async systemOpenToggle() {
    await this.systemService.putIsSystemOpen(this.isSystemOpen);
  }

}
