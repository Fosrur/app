$(document).ready(function () {
    /**
     * 
     * @param {any} str
     * @returns
     */
    const capitalize = function (str) {
        return Object.fromEntries(
            Object.entries(str).map(([key, value]) => [key.charAt(0).toUpperCase() + key.slice(1), value])
        );
    }

    /**
     * 
     * @param {any} response
     */
    const handleAjaxSuccess = function (response) {
        if (response.esito === "OK") {
            $('#city').DataTable().ajax.reload();
            showSuccessMessage("Operazione eseguita");
        } else {
            showErrorMessage(response.error || "Unknown error");
        }
    }

    /**
     * 
     * @param {any} message
     */
    const showSuccessMessage = function (message) {
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-right",
            iconColor: "white",
            customClass: {
                popup: "colored-toast"
            },
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        Toast.fire({
            icon: "success",
            html: message
        });
    }

    /**
     * 
     * @param {any} message
     */
    const showErrorMessage = function (message) {
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-right",
            iconColor: "white",
            customClass: {
                popup: "colored-toast"
            },
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true
        });

        Toast.fire({
            icon: "error",
            html: message
        });
    }


    const editor = new DataTable.Editor({
        ajax: {
            create: {
                type: "POST",
                url: '/City/Create',
                dataType: 'text',
                data: function (d) {
                    return { json: JSON.stringify(capitalize(d.data[0])) };
                }
            },
            edit: {
                type: 'PUT',
                url: '/City/Update',
                dataType: 'text',
                data: function (d) {
                    var idSelected;
                    $.each(d.data, function (key, value) {
                        idSelected = value.id;
                    });
                    return { json: JSON.stringify(capitalize(d.data[idSelected])) };
                }
            },
        },
        table: "#city",
        idSrc: 'id',
        formOptions: {
            main: {
                onEsc: false,
                backdrop: 'static',
                onBackground: 'none',
                onBlur: 'none',
                onComplete: 'none'
            }
        },
        fields: [
            { name: "id", label: "#", type: "hidden", def: "0" },
            { name: "nome", label: "Nome" },
            { name: "provincia", label: "Provincia" },
            { name: "regione", label: "Regione" },
            { name: "nazione", label: "Nazione" },
            {
                name: "status",
                label: "stato",
                type: "hidden",
                def: 1
            }
        ],
        i18n: {
            datetime: {
                months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                weekdays: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
                hours: 'Ore',
                minutes: 'Minuti',
                seconds: 'Secondi'
            },
        }
    });
    editor.on('preOpen', function (e) {
        var mode = editor.mode(); 
        if (mode === "create") { table.rows().deselect(); }
    });
    editor.on('preSubmit', function (e, o, action) {
        const fieldLabels = {
            'nome': 'Nome',
            'provincia': 'Provincia',
            'regione': 'Regione',
            'nazione': 'Nazione'
        };
        const requiredFields = ['nome','provincia', 'regione', 'nazione'];
        let errorFields = [];

        if (action === 'create') {
            requiredFields.forEach(fieldName => {
                const field = this.field(fieldName);

                if (!field.isMultiValue() && !field.val()) {
                    const fieldLabel = fieldLabels[fieldName] || fieldName;
                    field.error(`Il campo ${fieldLabel} è obbligatorio`);
                    errorFields.push(fieldLabel);
                }
            });

            if (errorFields.length > 0) {
                return false;
            }
        }
        if (action === 'edit' || action === "remove") {
            let errorFields = [];

            requiredFields.forEach(fieldName => {
                const field = this.field(fieldName);

                if (!field.isMultiValue() && !field.val()) {
                    const fieldLabel = fieldLabels[fieldName] || fieldName;
                    field.error(`Il campo ${fieldLabel} è obbligatorio`);
                    errorFields.push(fieldLabel);
                }
            });

            if (errorFields.length > 0) {
                const errorText = errorFields.join(', ');

                Swal.fire({
                    title: 'Oops...',
                    text: "Uno o più campi obbligatori sono vuoti, impossibile salvare.",
                    icon: 'error',
                    footer: `Campi in errore: ${errorText}`,
                    confirmButtonColor: "#909397",
                    allowOutsideClick: false
                });

                return false;
            }
        }
    });
    editor.on('submitComplete', function (e, json, data, action) {
        if ((action === 'create' || action === 'edit') && json.esito === 'OK') {
            editor.close();
            $('#city').DataTable().ajax.reload();
        }
    });

    var table = new DataTable('#city', {
        drawCallback: function () {
            $("#city div.dt-buttons button.btn").removeClass("btn-danger");
            $("#city_wrapper button#cityBtn").removeClass("btn btn-secondary buttons-excel buttons-html5 btn-danger").addClass("my-2 btn-icon-text btn btn-secondary btn-danger");
            $("#city_wrapper button#colVisibilityBtn").removeClass("btn btn-secondary buttons-collection dropdown-toggle buttons-colvis btn-danger").addClass("btn btn-secondary buttons-collection dropdown-toggle buttons-page-length btn-danger my-2 btn-icon-text");
            $("#city_filter input").removeClass("form-control-sm").addClass("form-control-md");
        },
        serverSide: false,
        processing: true,
        responsive: {
            details: {
                type: 'column',
                target: 'tr',
                renderer: function (api, rowIdx, columns) {
                    var isMobile = $(window).width() <= 767;
                    var data = $.map(columns, function (col, i) {
                        return col.hidden ?
                            '<div class="detail-row" data-dt-row="' + col.rowIndex + '" data-dt-column="' + col.columnIndex + '">' +
                            '<span> <b>' + col.title + ': </b> </span>' +
                            (isMobile ? '<div style="white-space: normal;">' + col.data + '</div>' : '<span>' + col.data + '</span>') +
                            '</div>' :
                            '';
                    }).join('');

                    return data ? data : false;
                }
            }
        },
        ajax: {
            url: '/City/GetCity',
            type: 'GET',
            contentType: 'application/json',
            data: function (d) {
                return JSON.stringify(d);
            },
        },
        stateSave: {
            // Abilita il salvataggio dello stato
            stateSave: true,
            // Configura il salvataggio dello stato solo per il plugin colvis
            stateSaveCallback: function (settings, data) {
                data.colVis = settings.colVis;
                localStorage.setItem('DataTables_' + settings.sInstance, JSON.stringify(data));
            },
            stateLoadCallback: function (settings) {
                var data = JSON.parse(localStorage.getItem('DataTables_' + settings.sInstance));
                if (data) {
                    settings.colVis = data.colVis;
                }
                return data;
            }
        },
        dom: 'Bfrtip',
        pageLength: 10,
        lengthMenu: [
            [5, 10, 15, 25, 50, 100, -1],
            [5, 10, 15, 25, 50, 100, 'Tutto']
        ],
        language: {
            url: "../dataTables/language/it-IT.json"
        },
        select: true,
        select: {
            style: 'single'
        },
        buttons: [
            {
                extend: "create",
                className: "btn-danger my-2 btn-icon-text",
                text: '<i class="fas fa-plus" style="display: block;"></i>',
                editor: editor,
                formTitle: 'Crea',
                formButtons: [
                    {
                        label: 'Annulla',
                        className: 'btn btn-secondary mr-2',
                        action: function (e, dt, node, config) {
                            editor.close();
                        }
                    },
                    {
                        label: 'Crea',
                        className: 'btn btn-danger',
                        action: function (e, dt, node, config) {
                            editor
                                .on('postSubmit', function (e, o, action) {
                                    handleAjaxSuccess(o);
                                })
                                .submit();
                        }
                    }
                ]
            },
            {
                extend: "edit",
                className: "btn btn-danger my-2 btn-icon-text",
                text: '<i class="fas fa-edit" style="display: block;"></i>',
                editor: editor,
                formTitle: 'Modifica',
                formButtons: [
                    {
                        label: 'Annulla',
                        className: 'btn btn-secondary mr-2',
                        action: function (e, dt, node, config) {
                            editor.close();
                        }
                    },
                    {
                        label: 'Modifica', className: 'btn btn-danger',
                        action: function (e, dt, node, config) {
                            editor
                                .on('postSubmit', function (e, o, action) {
                                    handleAjaxSuccess(o);
                                })
                                .submit();
                        }
                    }
                ]
            },
            {
                extend: "selected",
                className: "btn btn-danger my-2 btn-icon-text",
                text: '<i class="fas fa-trash" style="display: block;"></i>',
                formTitle: 'Cancella',
                action: function (e, dt, node, config) {
                    var selectedRows = dt.rows({ selected: true });
                    var rows = selectedRows.indexes();

                    editor
                        .hide(editor.fields())
                        .one('close', function () {
                            setTimeout(function () {
                                // Wait for animation
                                editor.show("nome");
                                editor.show("provincia");
                                editor.show("regione");
                                editor.show("nazione");
                            }, 500);
                        })
                        .edit(rows, {
                            title: 'Cancella',
                            message: (selectedRows.count() === 1)
                                ? 'Sei sicuro di voler cancellare la seguente città: ' + selectedRows.data()[0].nome + '?'
                                : 'Sei sicuro di voler cancellare queste ' + selectedRows.count() + ' righe?',
                            buttons: [
                                {
                                    label: 'Annulla',
                                    className: 'btn btn-secondary mr-2',
                                    action: function (e, dt, node, config) {
                                        editor.close();
                                    }
                                },
                                {
                                    label: 'Ok',
                                    className: 'btn-danger',
                                    fn: function () {
                                        editor
                                            .val('status', 0)
                                            .on('postSubmit', function (e, o, action) {
                                                handleAjaxSuccess(o);
                                            })
                                            .submit();
                                    }
                                }
                            ]
                        });
                }
            },
            {
                extend: "excelHtml5",
                attr: { id: 'cityBtn' },
                className: 'btn btn-danger',
                text: '<i class="fas fa-file-excel"></i>',
                exportOptions: {
                    format: {
                        body: function (data, row, column, node) {
                            return column === 0 ? data : data;
                        }
                    },
                    columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
                },
                filename: function () { return "Città"; }
            },
            {
                extend: 'colvis',
                attr: { id: 'colVisibilityBtn' },
                className: 'btn btn-danger',
                text: '<i class="fas fa-eye"></i>',
                columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
                postfixButtons: ['colvisRestore']
            },
            {
                extend: "pageLength",
                attr: { id: 'pagelength' },
                className: "btn btn-danger my-2 btn-icon-text"
            }
        ],
        columns: [
            {
                "data": "id", visible: false
            },
            {
                "data": "nome", visible: true
            },
            {
                "data": "provincia", visible: true
            },
            {
                "data": "regione", visible: true
            },
            {
                "data": "nazione", visible: true
            },
            {
                "data": "popolazione", visible: false
            },
            {
                "data": "superficie", visible: false
            },
            {
                "data": "altitudine", visible: false
            },
            {
                "data": "longitudine", visible: false
            },
            {
                "data": "latitudine", visible: false
            },
            {
                "data": "dataFondazione", visible: false
            },
            {
                "data": "sitoWeb", visible: false
            },
            {
                "data": "note", visible: false
            }
        ],
        order: [[0, "desc"]]
    });
});