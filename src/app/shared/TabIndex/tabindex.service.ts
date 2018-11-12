import { Injectable } from '@angular/core';

@Injectable()
export class TabIndexService {

  constructor() { }

  assignTabIndex() {

    var sorted;
    var xElement = [], yElement = [];
    var main = [];
    var ele;
    $('input:visible,select:visible,textarea:visible,buton:visible').not('total-claim-calculator input,total-claim-calculator-v2 input').each(function (index, item) {
      xElement.push($(item).offset().left);
      yElement.push($(item).offset().top);
      ele = { e: item, x: $(item).offset().left, y: $(item).offset().top };
      main.push(ele);
    });
    
    var xLatest = xElement.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    var yLatest = yElement.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });

    xLatest = xLatest.sort(function (a, b) { return a - b });
    yLatest = yLatest.sort(function (a, b) { return a - b });

    var tab = 1, i, j, k;
    for (i = 0; i < yLatest.length; i++) {
      for (j = 0; j < xLatest.length; j++) {
        for (k = 0; k < main.length; k++) {
          if (main[k].y == yLatest[i] && main[k].x == xLatest[j]) {
            $(main[k].e).attr('tabindex', tab);
            tab++;
          }
        }
      }
    }

  }
}
