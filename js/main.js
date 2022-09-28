/* 
    КАРКУЛЯТОР 1.0 / 27 сентября 2022 / by Serenq
    
    Основные возможности:
    - Проверка ввода, и ещё кое чего.
    - Предварительный просмотр результата.
    - Возможность не прирывать вычисление нажимая на математические операторы.
    - После нажатия кнопки (=), обновляется ввод.
*/

//CALC.EXE
;(function(){
    const btn = $('.btn');
    const input = $('.display__input');
    const notice = $('.container__notice');
    const btn_pattern = /^((((\-?0\.\d*)|(\-?[1-9]+\.?\d*)|0|(\-\d))([\+\-\*\/]((\-?0\.\d*)|(\-?[1-9]+\.?\d*)|0)?)?)|\-)$/; // Проверка ввода
    const inp_pattern = /[^\d\.\+\-\*\/]/gi; // Можно писать руками только: цифры, точки и (+-*/)
    const exist_pattern = /^(\-?\d(\.?\d*))([\+\-\*\/](\-?\d(\.?\d*)))$/; // Проверка вычислений. Соотв(2+2)
    const placeholder = ['Каркулятор','2 + 2 * 2 = 8','Красота','Готов!','Приятный результат'];

    let calc = {
        value: '',
        executed: false,
        placehold: function(){
            let rand = Math.floor(Math.random() * placeholder.length);
            input.attr('placeholder', placeholder[rand]);
        },
        btnToInput: function(e){
            calc.alredyDone(e);//Если посчитано, была нажата кнопка (=)
            calc.infinitScore(e);// Возможность продолжить вычисления после результата
            calc.value += $(this).attr('data-btn') || '';
            calc.notice();// Предварительный просмотр результата
            // Очистить инпут по нажатию КЛЕР
            if( $(this).hasClass('btn-clr') ){ calc.clear() }

            calc.wrongType().button();// Проверка ввода кликая

            // Ввод данных
            input.val(calc.value);
            // Если в строке уже есть выражение. Нужно вычислить
            if( $(this).hasClass('btn-execute') ){
                calc.result(); notice.text('...');
            }
        },
        typeToInput: function(e){
            calc.value = input.val();
            calc.notice();// Предварительный просмотр результата
            if(e.which == 32){ calc.clear() } // SPACE

            calc.wrongType().keyboard();// Проверка ввода клавиатуры

            // Enter - Результат
            if(e.which == 13){ calc.result() } // ENTER
        },
        patternTest: function(pat){
            // Проверка на соответсие патерну true/false
            return btn_pattern.test(pat || calc.value);
        },
        wrongType: function(){
            // Проверка ввода кликая
            function button(){
                if(!calc.patternTest()){
                    calc.value = calc.value.slice(0,-1);
                    return;
                }
            }
            // Проверка ввода клавиатуры
            function keyboard(){
                // Если печатается чушь, удалить запрещённые символы.
                if(!calc.patternTest(inp_pattern)){
                    calc.value = calc.value.replace(inp_pattern, '');
                    input.val(calc.value);
                    // Соответсвие главному шаблону
                    if(!calc.patternTest()){calc.clear();return;}
                    return;
                }
            }
            return {button: button, keyboard: keyboard}
        },
        clear: function(){
            calc.value = '';
            calc.placehold();
            input.val('');
            notice.text('...');
        },
        result: function(){
            input.val( eval(calc.value) );
            calc.value = input.val();
        },
        infinitScore: function(e){
            // Возможность продолжить вычисления после результата
            if(
                exist_pattern.test(calc.value)
                && $(e.currentTarget).hasClass('btn-math')
            ){calc.result()}
        },
        notice: function(){
            // Предварительный просмотр результата
            if( exist_pattern.test(calc.value) ){notice.text( eval(calc.value) )}
        },
        alredyDone: function(e){
            //Если посчитано, была нажата кнопка (=)
            if(calc.executed){
                calc.executed = false;
                calc.clear();
                input.val(calc.value);
            }

            if( !calc.executed && $(e.currentTarget).hasClass('btn-execute') ){calc.executed = true}
        }
    };

    btn.on('click', calc.btnToInput);
    input.on('keyup', calc.typeToInput);
}());//CALC.EXE