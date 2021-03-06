/*! jQuery magic tables v1.0 | (c) 2013 Robert Reimi  MIT License | magictables.androb.com  */
(function(jQuery) {
    jQuery.fn.magicTable = function(opts){

        var options = jQuery.extend({}, {
            skipColumns: [],
            displayLabels: true,
            skipLabels: [],
            skipFoot: true,
            customTitle: '',
            labelSeparator: '',
            responsiveWidth: 1024
        }, opts);

        function viewport() {
            var e = window
                , a = 'inner';
            if ( !( 'innerWidth' in window ) )
            {
                a = 'client';
                e = document.documentElement || document.body;
            }
            return { width : e[ a+'Width' ] , height : e[ a+'Height' ] }
        }

        this.each(function(){
            var table = jQuery(this)[0];
            var theTitle = '', i;
            var index = 1;
            var header = new Array();
            var isFoot = false;

            jQuery(this).addClass('magic-table');

            if (viewport().width <= options.responsiveWidth){
                table.className = table.className + " rt-table";
            }

            for(i = 0; i < table.rows[0].cells.length; i++){
                header[i] = table.rows[0].cells[i];
            }

            jQuery(table.rows[0]).addClass('rt-skip');

            for(i = 1; i < table.rows.length; i++){

                theTitle = options.customTitle;
                isFoot = false;

                //Skip thead
                if (table.rows[i].parentNode.nodeName === 'THEAD'){
                    jQuery(table.rows[i]).addClass('rt-skip');
                    continue;
                }

                if (table.rows[i].parentNode.nodeName === 'TFOOT'){
                    isFoot = true;
                    theTitle = '';

                    if (options.skipFoot) {
                        jQuery(table.rows[i]).addClass('rt-skip');
                        continue;
                    }
                }

                if (!isFoot) {
                    if ((index) % 2 == 0){
                        jQuery(table.rows[i]).addClass('rt-odd');
                    } else {
                        jQuery(table.rows[i]).addClass('rt-even');
                    }
                    index++;
                }

                for (var j = 0; j < table.rows[i].cells.length; j++){

                    var className = table.rows[i].cells[j].className;

                    if (!isFoot && options.skipColumns.indexOf(j) >= 0){
                        className += " rt-skip rt-row rt-row-" + j;
                    }

                    //Build the title
                    if (theTitle != '') {
                        theTitle = theTitle.replace(new RegExp('\\{' + j + '}',"g"), table.rows[i].cells[j].innerHTML);
                    }

                    if (className != ''){
                        table.rows[i].cells[j].className = className;
                    }

                    var rowContent = '';

                    if (options.displayLabels) {
                        if (options.skipLabels.indexOf(j) == -1){
                            rowContent += '<span class="rt-visible rt-lbl">' + header[j].innerHTML + options.labelSeparator + ' </span>';
                        }
                    }

                    rowContent = rowContent + table.rows[i].cells[j].innerHTML;
                    table.rows[i].cells[j].innerHTML = rowContent;
                }

                if (theTitle != '') {
                    var theKid = document.createElement("td");
                    theKid.innerHTML = theTitle;
                    theKid.className = 'rt-block';
                    table.rows[i].insertBefore(theKid, table.rows[i].firstChild);
                }
            }
        });

        /* Resize events */
        jQuery(window).on("resize", function(){
            jQuery('.magic-table').each(function (){
                var isResponsive = jQuery(this).hasClass('rt-table');
                if ((viewport().width <= options.responsiveWidth) && (!isResponsive)){
                    jQuery(this).addClass('rt-table');
                }

                if ((viewport().width > options.responsiveWidth) && (isResponsive)) {
                    jQuery(this).removeClass('rt-table');
                    //console.log('change table to not responsive');
                }
            });
        });
        return this;
    }
}(jQuery));