import telebot
import requests
from telebot import types

token = '1473751827:AAEWHigUtQzzdj08GIKaf9_06CfFqllb4VQ'
bot = telebot.TeleBot(token)


@bot.message_handler(commands=['start'])
def start_message(message):
    # выводим клавиатуру
    markup = types.ReplyKeyboardMarkup(resize_keyboard=True)
    item1 = types.KeyboardButton('Мобильная связь')
    item2 = types.KeyboardButton('Интернет')
    item3 = types.KeyboardButton('Специалист')
    markup.add(item1, item2, item3)
    # приветствие после команды /start
    bot.send_message(message.chat.id, 'Здравствуйте, {0.first_name}!\nВас приветствует - <b>{1.first_name}</b>.\n \n'
                                      'Выберите необходимый пункт меню:\n'.format(message.from_user,
                                                                               bot.get_me()), parse_mode='html',
                     reply_markup=markup)


@bot.message_handler(content_types=['text', 'document', 'photo'])
def lalala(message):
    if message.chat.type == 'private':
        if message.text == 'Мобильная связь':
            markup_vklad = types.InlineKeyboardMarkup(row_width=1)
            item4 = types.InlineKeyboardButton('Тарифы на мобильную связь', callback_data='tarif')
            item5 = types.InlineKeyboardButton('Роуминг', callback_data='rouming')
            markup_vklad.add(item4, item5)
            bot.send_message(message.chat.id, 'Выберите:', reply_markup=markup_vklad)

        elif message.text == 'Интернет':
            markup_kredit = types.InlineKeyboardMarkup(row_width=1)
            item6 = types.InlineKeyboardButton('Домашнний интернет', callback_data='home_internet')
            item7 = types.InlineKeyboardButton('Антивирусы', callback_data='antivitus')
            markup_kredit.add(item6, item7)
            bot.send_message(message.chat.id, 'Выберите:', reply_markup=markup_kredit)



        elif message.text == 'Специалист':
            '''не работает'''
            bot.send_message(message.chat.id, 'Отправлен запрос на консультацию.\nВ ближайшее время с вами свяжется специалист Ростелеком..')
            bot.send_message(chat_id=71404035, text=f'Клиент @{message.from_user.username} просит начать консультацию')

        else:
            bot.send_message(message.chat.id, 'Неверная команда')


@bot.callback_query_handler(func=lambda call: True)
def callback_inline(call):
    try:
        if call.message:
            # МОБИЛЬНАЯ СВЯЗЬ
            if call.data == 'tarif':
                bot.send_message(call.message.chat.id, 'Тарифы на мобильную связь: https://moscow.rt.ru/mobile/mobile_tariff')
            elif call.data == 'rouming':
                bot.send_message(call.message.chat.id, 'Тарификация в поездках по России: https://moscow.rt.ru/mobile/roaming')
            # ИНТЕРНЕТ
            elif call.data == 'home_internet':
                bot.send_message(call.message.chat.id, 'Подключить интернет в г. Москва: https://moscow.rt.ru/homeinternet')
            elif call.data == 'antivitus':
                bot.send_message(call.message.chat.id, 'Подпишитесь на безопасность: https://moscow.rt.ru/homeinternet/antiviruses')

            # убрать inline button
            bot.edit_message_text(chat_id=call.message.chat.id, message_id=call.message.message_id, text='Соглашение на обработку данных', reply_markup=None)
            bot.edit_message_text(f1=call.message.chat.id, f2=call.message.message_id, text='Принято!')
    except Exception as e:
        print(repr(e))


class Specialist:
    """Работа чат-специалиста"""
    pass



# СТАРТ
if __name__ == '__main__':
     bot.polling(none_stop=True)