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
     * @param {any} inputDateTime
     * @returns
     */
    const formatDateTime = function (inputDateTime) {
        const date = new Date(inputDateTime);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const formattedDay = day < 10 ? `0${day}` : day;
        const formattedMonth = month < 10 ? `0${month}` : month;
        const formattedDateTime = `${formattedDay}/${formattedMonth}/${year}`;

        return formattedDateTime;
    }

    /**
     * 
     * @param {any} options
     * @param {any} field
     * @param {any} selectedValue
     */
    const updateSelectOptions = function (options, field, selectedValue) {
        const input = editor.field(field).input();

        // Rimuovi tutte le opzioni attuali
        input.find('option').remove();

        // Aggiungi le nuove opzioni
        options.forEach(function (option) {
            input.append($('<option>', {
                value: option.id,
                text: option.text
            }));
        });

        // Forza l'aggiornamento di Select2
        if (selectedValue) {
            input.val(selectedValue).trigger('change');
        }
    };

    /**
     * 
     * @param {any} response
     */
    const handleAjaxSuccess = function (response) {
        if (response.esito === "OK") {
            $('#addressBook').DataTable().ajax.reload();
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
                url: '/AddressBook/Create',
                dataType: 'text',
                data: function (d) {
                    return { json: JSON.stringify(capitalize(d.data[0])) };
                }
            },
            edit: {
                type: 'PUT',
                url: '/AddressBook/Update',
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
        table: "#addressBook",
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
            { name: "cognome", label: "Cognome" },
            {
                name: "idSesso",
                label: "Sesso",
                type: 'select2'
            },
            {
                name: "dataNascita",
                label: "Data di nascita",
                type: 'datetime',
                def: () => new Date(),
                format: 'DD/MM/YYYY',
                attr: { placeholder: "dd/mm/yyyy" },
                opts: {
                    minDate: new Date('1900-01-01'),
                    maxDate: new Date('2100-12-31')
                }
            },
            { name: "numeroTelefono", label: "Numero di telefono" },
            { name: "email", label: "Email" },
            {
                name: "idCitta",
                label: "Citta",
                type: 'select2',
                opts: {
                    allowClear: true,
                    placeholder: 'Seleziona un valore'
                }
            },
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
    editor.on('preOpen', function (e, mode, action) {
        const modifier = editor.modifier();
        const data = table.row(modifier).data();

        if (action === "create") {
            table.rows().deselect();

            $.ajax({
                type: "GET",
                url: '/Gender/GetGender',
                dataType: 'json',
                success: function (response) {
                    if (response.esito === "OK") {
                        const options = $.map(response.data, function (obj) {
                            return { id: obj.id, text: obj.descrizione };
                        });

                        // Ordina gli oggetti options in base alla proprietà 'text' (descrizione)
                        options.sort(function (a, b) {
                            return a.text.localeCompare(b.text);
                        });

                        updateSelectOptions(options, 'idSesso', -1);
                    }
                }
            });

            $.ajax({
                type: "GET",
                url: '/City/GetCity',
                dataType: 'json',
                success: function (response) {
                    if (response.esito === "OK") {
                        const options = $.map(response.data, function (obj) {
                            return { id: obj.id, text: obj.nome };
                        });

                        // Ordina gli oggetti options in base alla proprietà 'text' (nome)
                        options.sort(function (a, b) {
                            return a.text.localeCompare(b.text);
                        });


                        updateSelectOptions(options, 'idCitta', -1);
                    }
                }
            });
        }
        if (action === "edit" && modifier) {
            editor.set('dataNascita', formatDateTime(data["dataNascita"]));

            $.ajax({
                type: "GET",
                url: '/Gender/GetGender',
                dataType: 'json',
                success: function (response) {
                    if (response.esito === "OK") {
                        const options = $.map(response.data, function (obj) {
                            return { id: obj.id, text: obj.descrizione };
                        });

                        // Ordina gli oggetti options in base alla proprietà 'text' (descrizione)
                        options.sort(function (a, b) {
                            return a.text.localeCompare(b.text);
                        });


                        updateSelectOptions(options, 'idSesso', data.idSesso);
                    }
                }
            })

            $.ajax({
                type: "GET",
                url: '/City/GetCity',
                dataType: 'json',
                success: function (response) {
                    if (response.esito === "OK") {
                        const options = $.map(response.data, function (obj) {
                            return { id: obj.id, text: obj.nome };
                        });

                        // Ordina gli oggetti options in base alla proprietà 'text' (nome)
                        options.sort(function (a, b) {
                            return a.text.localeCompare(b.text);
                        });


                        updateSelectOptions(options, 'idCitta', data.idCitta || -1);
                    }
                }
            })
        }
    });
    editor.on('open', function (e, mode, action) {
        $('#DTE_Field_idSesso').select2({
            dropdownParent: $('.modal'),
            width: "100%",
            allowClear: true,
            placeholder: "Seleziona un elemento"
        });
        $('#DTE_Field_idCitta').select2({
            dropdownParent: $('.modal'),
            width: "100%",
            allowClear: true,
            placeholder: "Seleziona un elemento"
        });
    });
    editor.on('preSubmit', function (e, o, action) {
        const fieldLabels = {
            'nome': 'Nome',
            'cognome': 'Cognome',
            'idSesso': 'Sesso',
            'email': 'Email',
        };
        const requiredFields = ['nome', 'cognome', 'idSesso', 'email'];
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
            $('#addressBook').DataTable().ajax.reload();
        }
    });

    var table = new DataTable('#addressBook', {
        drawCallback: function () {
            $("#addressBook div.dt-buttons button.btn").removeClass("btn-danger");
            $("#addressBook_wrapper button#addressBookBtn").removeClass("btn btn-secondary buttons-excel buttons-html5 btn-danger").addClass("my-2 btn-icon-text btn btn-secondary btn-danger");
            $("#addressBook_wrapper button#colVisibilityBtn").removeClass("btn btn-secondary buttons-collection dropdown-toggle buttons-colvis btn-danger").addClass("btn btn-secondary buttons-collection dropdown-toggle buttons-page-length btn-danger my-2 btn-icon-text");
            $("#addressBook_filter input").removeClass("form-control-sm").addClass("form-control-md");
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
            url: '/AddressBook/GetAddressBook',
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
                                editor.show("cognome");
                                editor.show("idSesso");
                                editor.show("dataNascita");
                                editor.show("numeroTelefono");
                                editor.show("email");
                                editor.show("idCitta");
                            }, 500);
                        })
                        .edit(rows, {
                            title: 'Cancella',
                            message: (selectedRows.count() === 1)
                                ? 'Sei sicuro di voler cancellare il seguente contatto: ' + selectedRows.data()[0].nome + ' ' + selectedRows.data()[0].cognome + '?'
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
                attr: { id: 'addressBookBtn' },
                className: 'btn btn-danger',
                text: '<i class="fas fa-file-excel"></i>',
                exportOptions: {
                    format: {
                        body: function (data, row, column, node) {
                            return column === 0 ? data : data;
                        }
                    },
                    columns: [1, 2, 4, 5, 6, 7, 9]
                },
                filename: function () { return "Rubrica"; }
            },
            {
                extend: 'colvis',
                attr: { id: 'colVisibilityBtn' },
                className: 'btn btn-danger',
                text: '<i class="fas fa-eye"></i>',
                columns: [1, 2, 4, 5, 6, 7, 9],
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
                "data": "cognome", visible: true
            },
            {
                "data": "idSesso", visible: false
            },
            {
                "data": "sesso", visible: true
            },
            {
                "data": "dataNascita", visible: true
            },
            {
                "data": "numeroTelefono", visible: true
            },
            {
                "data": "email", visible: true
            },
            {
                "data": "idCitta", visible: false
            },
            {
                "data": "citta", visible: true
            }
        ],
        columnDefs: [
            {
                targets: [5],
                type: 'datetime',
                render: {
                    display: function (data) {
                        return data ? moment(data, 'YYYY/MM/DD').format('DD/MM/YYYY') : '';
                    },
                    filter: function (data) {
                        return data ? moment(data, 'DD/MM/YYYY').toISOString() : '';
                    }
                }
            }
        ],
        order: [[0, "desc"]]
    });
});