import { Component, OnInit, OnChanges, Output, Input, SimpleChanges } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TermsOfUse } from '../entities/termsofuse';
declare var $: any;

@Component({
    selector: 'rich-text-editor',
    templateUrl: './richTextEditor.component.html',
    styleUrls: ['./richTextEditor.component.css']
})
export class RichTextEditorComponent implements OnInit,OnChanges {
    TermsofUseText: string;
    editMode: boolean;
    oldTermsOfUse:TermsOfUse;
    isInvalid:boolean;
    @Input() termsOfUse: TermsOfUse;
    @Input() isLatest: boolean;
    @Output() onEditEvent = new EventEmitter();
    @Output() onSaveEvent = new EventEmitter();
    @Output() onCancelEvent = new EventEmitter();
    @Output() onCreateNewEvent = new EventEmitter();

    constructor() { }

    ngOnInit() {

        if (this.isLatest) {
            this.editMode = false;
            this.isInvalid=false;
        }
        else {
            this.editMode = true;
            this.isInvalid=false;
        }
    }

    ngOnChanges(changes :SimpleChanges)
    {
        for(let props in changes)
        {
            if(props=="isLatest")
            {
                //changes[props].
              /*   if(changes[props].currentValue==changes[props].previousValue)
                console.log("Changes Occured"); */
                if(changes[props].currentValue)
                {
                    this.editMode=false;
                }
                else{
                    this.editMode=true;
                }
                this.isInvalid=false;
            
            }
            if(props="termsOfUse")
            {
                
                this.termsOfUse=changes[props].currentValue;
            }
        }
    }
    onEdit() {
        this.editMode = true;
        $("#editor").eq(0).attr("contenteditable", true);
        this.editMode = true;
    }
    onSave(): void {
        this.termsOfUse.termsOfUseText = $('#editor').html();
        if(this.checkValidation())
        {
            this.isInvalid=true;
            this.isLatest=false;
        }
        
        else
        {
            this.isInvalid=false;
            this.isLatest = true;
            this.editMode = false;
            $("#editor").eq(0).attr("contenteditable", false);
            this.onSaveEvent.emit(this.termsOfUse);
        }
       
    }
    onCancel() {
        this.editMode = false;
        this.isInvalid=false;
        var tempText = this.termsOfUse.termsOfUseText;
        if (this.termsOfUse.id == undefined)
           this.termsOfUse=this.oldTermsOfUse;
        $("#editor").eq(0).attr("contenteditable", false);
    }
    onCreateNew() {
        this.editMode = true;
        this.isLatest=true;
        this.oldTermsOfUse=this.termsOfUse;
        this.termsOfUse = new TermsOfUse();
        this.termsOfUse.termsOfUseText="";
        $("#editor").eq(0).attr("contenteditable", true);
    }
  
    checkValidation()
    {
        
        if(this.termsOfUse.termsOfUseText==undefined || this.termsOfUse.termsOfUseText=="" || this.termsOfUse.termsOfUseText=="<br>")
        return true;
        else
        return false;
    }
    onPaste(e: any) {
        e.preventDefault();
        if ( e.clipboardData ) {
            this.termsOfUse.termsOfUseText = (e.originalEvent || e).clipboardData.getData('text/plain') ;
            document.execCommand("insertText", false, this.termsOfUse.termsOfUseText);
        }
        else if ( (window as any).clipboardData ) {
            this.termsOfUse.termsOfUseText = (window as any).clipboardData.getData('Text');
            if ((window as any).getSelection)
                (window as any).getSelection().getRangeAt(0).insertNode( document.createTextNode(this.termsOfUse.termsOfUseText) );
        }
    }
    makeBold() {
        document.execCommand('bold', false, null);
    }

    makeItalics() {
        document.execCommand('italic', false, null);
    }

    makeUnderlined() {
        document.execCommand('underline', false, null);
    }

    makeLeft() {
        document.execCommand('justifyLeft', false, null);
    }

    makeCenter() {
        document.execCommand('justifyCenter', false, null);
    }

    makeRight() {
        document.execCommand('justifyRight', false, null);
    }
    insertUnorderedList() {
        document.execCommand('insertUnorderedList', false, null);
    }

    insertOrderedList() {
        document.execCommand('insertOrderedList', false, null);
    }

    makeSuperscript() {
        document.execCommand('superscript', false, null);
    }

    makeSubscript() {
        document.execCommand('subscript', false, null);
    }

    createLink() {
        var selected = document.getSelection();
        document.execCommand('createLink', false, 'http://' + selected);
        //create link in new tab
        selected.anchorNode.parentElement.setAttribute('target', '_blank');
    }

    removeLink() {
        document.execCommand('unlink', false, null);
    }

    generateHtmlCode() {
        HtmlElement2($("#editor"));

        function HtmlElement2(elem) {
            InsertHtml2($(elem).html());
        }

        function InsertHtml2(data) {
            var mywindow = window.open();
            mywindow.document.write('<html><head><title>Code</title>');
            mywindow.document.write('</head><body >');
            mywindow.document.write(data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
            mywindow.document.write('</body></html>');
            mywindow.document.close(); // necessary for IE >= 10
            mywindow.focus(); // necessary for IE >= 10
            return true;
        }
    }

    generateHtml() {
        HtmlElement2($("#editor"));

        function HtmlElement2(elem) {
            InsertHtml2($(elem).html());
        }

        function InsertHtml2(data) {

            return data.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        }
    }

}
