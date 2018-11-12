import { Component, OnInit } from '@angular/core';
import { ConfirmationModal } from './entities/confirmation-modal';
import { FormsModule } from '@angular/forms';
import { AnnouncementModel } from '././models/announcements.model';
import { Announcement } from './entities/announcement';
import { AnnouncementService } from './services/announcements.services';
import { NotificationMessage } from '../common/entity/notification-message';
import * as _ from 'lodash';
import * as moment from 'moment/moment';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
})

export class AnnouncementComponent implements OnInit {

  confirmationModal: ConfirmationModal = new ConfirmationModal();
  announcements: Announcement[];
  announcement: Announcement = new Announcement();
  headerText: string;
  titleFlag: boolean;
  dateFlag: boolean = true;

  notificationMessage: NotificationMessage = new NotificationMessage();

  private announcementModel: AnnouncementModel;

  constructor(private announcementService: AnnouncementService) {
    this.announcementModel = new AnnouncementModel(announcementService);
    this.confirmationModal.headerMessage = '';
    this.confirmationModal.bodyMessage = '';
  }
  ngOnInit() {
    this.getAll();
  }
  getAll() {

    this.announcementModel.getAnnouncements().subscribe(response => {
      
      this.announcements = response;
    
      this.announcements = _.orderBy(this.announcements, ['expiryDate'], ['desc']);
    
    })
  }

  openCreateAnnouncementModal() {

    this.headerText = "New";
    this.announcement.fromDate=new Date().toDateString();
    document.getElementById('createAnnouncementModalBtn').click();
  }
  onEdit(announcement) {

    this.announcement = announcement;
    this.headerText = "Edit";
    document.getElementById('createAnnouncementModalBtn').click();

  }

  onDelete(announcement: Announcement) {
    this.confirmationModal.headerMessage = 'Delete Announcement';
    this.confirmationModal.bodyMessage = 'Are you sure you want to delete the announcement ' + announcement.title + '?';
    this.announcement = announcement;
    document.getElementById('deleteButton').click();

  }

  onDeleteAnnouncement() {

    this.announcementModel.deleteAnnouncement(this.announcement.id).subscribe(res => {
      this.notificationMessage.errorMessage = 'Announcement '+this.announcement.title+" has been deleted successfully.";
      this.announcement = new Announcement();
      this.getAll();
    });

  }

  onSuccess(response: string) {
    this.getAll();
    this.notificationMessage.successMessage = response;
  }

  onError(message: string) {
    // this.notificationMessage.errorMessage = message;
  }
  onClose(): void {
    this.announcement = new Announcement();
    this.getAll();
  }

  sortTitle() {
    if (this.titleFlag) {
      this.announcements = _.orderBy(this.announcements, ['title'], ['asc']);
      this.titleFlag = !this.titleFlag;
    }
    else {
      this.announcements = _.orderBy(this.announcements, ['title'], ['desc']);
      this.titleFlag = !this.titleFlag;
    }
  }

  sortByDate() {
    if (this.dateFlag) {
      this.sortByDueDate()
      this.dateFlag = !this.dateFlag;
    }
    else {
      this.announcements = _.orderBy(this.announcements, ['expiryDate'], ['desc']);
      this.dateFlag = !this.dateFlag;
    }
  }

  public sortByDueDate(): void {
    this.announcements.sort((a: Announcement, b: Announcement) => {
      return +new Date(a.expiryDate) - +new Date(b.expiryDate);
    });
  }

  checkPreviousDate(date) {
    return moment(new Date(date)).isBefore(moment())
  }

  closeAlert()
  {
    this.notificationMessage.successMessage=undefined;
  }
}
