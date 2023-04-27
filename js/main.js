/* 
    КАРКУЛЯТОР 1.3 / 27 апреля 2023 / by Serenq
    
    Основные возможности:
    - Проверка ввода.
    - Форматирование матемитического алгоритма, можно вставлять чепуху.
    - Предварительный просмотр результата.
    - Возможность не прирывать вычисление нажимая на математические операторы.
    - После нажатия кнопки (=), можно продолжать вычисления.
*/

class Calculator {
    constructor(){
        this.value = '';
        this.el_buttons = $('.btn');
        this.el_input = $('.display-result__input');
        this.el_notice = $('.display-result__notice');
        this.el_skinBtn = $('.skin-switch__btn');
        this.placeholder = ['Каркулятор','2 + 2 * 2 = 8','Красота','Готов!','Приятный результат'];
        this.about = {
            title: 'Karkulator',
            ver: 1.3,
            author: 'Serenq',
            date: '27 apr 2023'
        }
        this.timer_dayUpdate = undefined;

        // Убирает лишние символы. Защита от ввода хуйни всякими ебланами.
        this.reg_allowedType = /\B[^\-\d\.\s]+|[^\d\+\-\*\/\.]|(?<=\d+[\+\-\*\/\.])[\+\*\/\.]+|(?<=\d+\-)\-+|\B[\+\-\*\/][\+\-\*\/]+|(?<=0+)0+\.|00+\.[0-9]+|(?<=[\+\-\*\/])0+[1-9]+|^00+[1-9\.\+\-\*\/]+|(?<=\.[0-9]+)\.|(?<=\.)\.+|(?<=\.)\-|\B\./g;
        // Проверка уже введённого для вывода подсказки БЕЗ ОШИБОК!
        this.reg_formattedVal = /^0$|(?:\-?[0-9]*?\.?[0-9]+)(?:[\+\-\*\/]?(?:[0-9]*?\.?[0-9]+))$/;

        this.el_buttons.on('click', this.clickButtons);
        this.el_input.on('keyup', this.typeString);
        this.el_skinBtn.on('click', this.skinChange);
    }

    timeDependence(){
        let hours = new Date().getHours();

        function setTheme(){
            if((hours >= 20 && hours <= 23) || (hours >= 0 && hours <= 7)){$('#calc').attr('class', 'skin-' + 'dark');} // С 20:00 до 7:00 - ночная тема
        }
        setTheme();

        this.timer_dayUpdate = setInterval(setTheme, 10000);
    }

    skinChange = (e) => {
        let getSkinData = $(e.currentTarget).attr('data-skin');

        function translate(input){
            return input == 'light' ? 'Светлая'
                : input == 'dark'? 'Тёмная'
                : input == 'nephrite' ? 'Нефритовая' : '...';
        }

        $('#calc').attr('class', 'skin-' + getSkinData);
        this.el_notice.text( 'Тема: ' + translate(getSkinData) );
        clearInterval(this.timer_dayUpdate);
    }

    reg_formatData(){
        this.value = this.el_input.val().replace(this.reg_allowedType, '');
        this.el_input.val(this.value);
    }

    set_placeholder = () => {
        let rand = Math.floor(Math.random() * this.placeholder.length);
        this.el_input.attr('placeholder', this.placeholder[rand]);
    }

    clickButtons = (e) => {
        this.value += $(e.currentTarget).attr('data-btn') || '';

        // Очистить инпут по нажатию КЛЕР
        if( $(e.currentTarget).hasClass('btn-clr') ){ this.clear() }

        // Если в строке уже есть выражение. Нужно вычислить
        if( $(e.currentTarget).hasClass('btn-execute') ){
            this.result();
            this.el_notice.text('...');
        }

        // Ввод данных
        this.el_input.val( this.value ); // Ввод данных
        this.reg_formatData(); // Форматирование ввода
        this.notice(); // Предварительный просмотр результата
    }

    typeString = (e) => {
        this.value = this.el_input.val(); // Ввод данных
        this.reg_formatData(); // Форматирование ввода
        this.notice(); // Предварительный просмотр результата

        if(e.which == 32){ this.clear() } // Space - Очистить
        if(e.which == 13){ this.result() } // Enter - Результат
    }

    result(){
        let reg = new RegExp(/[\+\-\*\/\.]\.?$/,'gm'); // Убрать символы в конце
        this.reg_formatData(); // Форматирование ввода
        this.value = this.value.replace(reg,''); // Убрать символы в конце
        this.value = eval(this.value);
        this.el_input.val( this.value );
    }

    notice(){
        // Предварительный просмотр результата. Если форматированный результат верен.
        if( this.reg_formattedVal.test(this.value) ){
            this.el_notice.text(eval(this.value));
        }
    }

    clear(){
        this.value = '';
        this.set_placeholder();
        this.el_input.val(this.value);
        this.el_notice.text('...');
    }

    init(){
        console.log(`%c${this.about.title} ${this.about.ver} by ${this.about.author} / ${this.about.date}`, "color: #ace600; font-style: italic; background-color: #444; padding: 0 20px");
        this.set_placeholder();
        this.timeDependence();
    }
}

new Calculator().init();