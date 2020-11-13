import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  @Input()
  leaders: Leader[];

  constructor(private leaderService: LeaderService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.leaders = this.leaderService.getLeaders();
  }

}
