import { Component, EventEmitter, Output, Input, OnDestroy, OnInit,SimpleChanges, OnChanges } from '@angular/core';
import { Announcement } from '../entities/announcement';
import { AnnouncementService } from '../services/announcements.services';
import { AnnouncementModel } from '../models/announcements.model';
import * as moment from 'moment/moment';

@Component({
  selector: 'create-edit-announcement',
  templateUrl: './create-edit-announcement.component.html',
  styleUrls: ['./create-edit-announcement.component.css']
})
export class CreateEditAnnouncementComponent implements OnDestroy,OnChanges {

  @Input() announcement: Announcement;
  @Input() headerText: string;

  @Output() onSaveEvent = new EventEmitter();
  @Output() onCloseEvent = new EventEmitter();
  @Output() onErrorEvent = new EventEmitter();

  isStartDateInvalid: boolean;
  isEndDateInvalid: boolean;
  isTitleInvalid: boolean;
  isBodyInvalid: boolean;
  showFlag: boolean = false;
  private announcementModel: AnnouncementModel;
  private modalHeader: string;
  private charLimitTitle: boolean;
  private charLimitBody: boolean;


  constructor(private announcementService: AnnouncementService) {
    this.announcementModel = new AnnouncementModel(announcementService);
  }

     ngOnChanges(){
      if (this.announcement.fromDate == undefined) {
        this.announcement.fromDate = new Date().toDateString();
        this.announcement.expiryDate = new Date().toDateString();;

      }
     }

  showExtra() {
      this.showFlag = !this.showFlag;
    }
  
  checkValidation() {
    if(this.checkDateDifference(this.announcement.fromDate,this.announcement.expiryDate) || this.checkPreviousDate(this.announcement.fromDate) || this.checkDateValidation() || this.announcement.title==undefined || this.announcement.body==undefined || this.announcement.fromDate==undefined|| this.announcement.expiryDate==undefined || this.isBodyInvalid || this.isTitleInvalid || this.isStartDateInvalid || this.isEndDateInvalid || this.charLimitBody || this.charLimitTitle)
    return true;
    else
    false;
  }

  onSave(): void {

    if (this.announcement.id == undefined) {
      this.announcementModel.addAnnouncement(this.announcement).subscribe(res => {
        this.onSaveEvent.emit("Announcement " + this.announcement.title + " has been saved successfully");
        this.announcement = new Announcement();
        document.getElementById("closeBtn").click();
      });
    }
    else {
      this.announcementModel.updateAnnouncement(this.announcement).subscribe(res => {

        this.onSaveEvent.emit("Announcement " + this.announcement.title + " has been updated successfully");
        this.announcement = new Announcement();
        document.getElementById("closeBtn").click();
      })

    }



  }
  onError(): void {
    this.onErrorEvent.emit("Error in creating/saving announcement");
  }

  onClose(): void {
    this.announcement = new Announcement();
    this.announcement.fromDate=undefined;
    this.announcement.expiryDate=undefined;
    this.charLimitBody = false;
    this.charLimitTitle = false;
    this.isBodyInvalid = false;
    this.isTitleInvalid = false;
    this.onCloseEvent.emit();
  }

  setStartDate(startDate: string) {
    this.announcement.fromDate = startDate;
  }

  setEndDate(endDate: string) {
    this.announcement.expiryDate = endDate;
  }
  checkStartDateFormat(value: boolean) {
    if (value)
      this.isStartDateInvalid = false;
    else
      this.isStartDateInvalid = true;
  }

  checkEndDateFormat(value: boolean) {
    if (value)
      this.isEndDateInvalid = false;
    else
      this.isEndDateInvalid = true;
  }


  checkDateValidation() {
    if (this.announcement)
      if (this.announcement.fromDate && this.announcement.expiryDate && !this.isStartDateInvalid && !this.isEndDateInvalid) {
        var fromDate = moment(new Date(this.announcement.fromDate), "dd-MMM-yyy");
        var currentDate=moment(new Date(this.announcement.expiryDate),"dd-MMM-yyy");
        return currentDate.isBefore(fromDate,'day');
      } else {
        return false;
      }
  }

  onChangeBody(val) {
    if(val=="")
    this.isBodyInvalid=true;
    else
    this.isBodyInvalid=false;
    if (val.length > 400)
      this.charLimitBody = true;
    else
      this.charLimitBody = false;
  }

  onChangeText(val) {
    if(val=="")
    this.isTitleInvalid=true;
    else
    this.isTitleInvalid=false;
    if (val.length > 75)
      this.charLimitTitle = true;
    else
      this.charLimitTitle = false;
  }

  checkPreviousDate(date)
  {
    if(this.headerText=='Edit'){
    return false;
    }
    else{
   var fromDate = moment(new Date(date), "dd-MMM-yyy");
   var currentDate=moment(new Date(),"dd-MMM-yyy");
   return fromDate.isBefore(currentDate,'day');
    }
  }

  // checkDateDifference(date)
  // {
  //   var untilDate = moment(date);
  //   if(date!=undefined && untilDate.diff(moment(),'days')>=365)
  //   {
  //     return true;
  //   }
  //   else
  //   return false;
  // }


  checkDateDifference(from,until)
  {
     var date1=moment(new Date(from), "dd/MM/yyyy");
     var date2=moment(new Date(until), "dd/MM/yyyy");

    var untilDate = moment(date2);
    if(from!=undefined  && until!=undefined&& untilDate.diff(moment(date1),'days')>=365)
    {
      return true;
    }
    else
    return false;
  }




  ngOnDestroy() {
    this.onSaveEvent.unsubscribe();
    this.onErrorEvent.unsubscribe();
    this.onCloseEvent.unsubscribe();
  }
}

