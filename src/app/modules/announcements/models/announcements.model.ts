import { Observable } from 'rxjs/Rx';
import { Announcement } from '../entities/announcement'
import { AnnouncementService } from '../services/announcements.services';

export class AnnouncementModel {

     constructor(private announcementService: AnnouncementService) {
    }

    getAnnouncements(): Observable<Announcement[]> {
        return this.announcementService.getAnnouncements();
    }
    
    addAnnouncement(announcement:Announcement):Observable<Announcement>
    {
        return this.announcementService.addAnnouncement(announcement);
    }

    updateAnnouncement(announcement:Announcement):Observable<boolean>
    {
        return this.announcementService.updateAnnouncement(announcement);
    }

    deleteAnnouncement(id:string):Observable<boolean>
    {
        return this.announcementService.deleteAnnouncement(id);
    }
}