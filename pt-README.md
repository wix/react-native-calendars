**PROCURANDO ALGUÉM PARA MANUTENÇÃO** <br>
Adoramos esse projeto, mas atualmente não temos tempo suficiente para trabalhar nele. Então, estamos procurando alguém para mantê-lo. Se você tiver tempo e conhecimento suficientes e quiser se tornar um - informe-nos. (levv@wix.com, inbalti@wix.com, ethans@wix.com)

---

# React Native Calendars ✨ 🗓️ 📆

[![Version](https://img.shields.io/npm/v/react-native-calendars.svg)](https://www.npmjs.com/package/react-native-calendars)
[![Build Status](https://travis-ci.org/wix/react-native-calendars.svg?branch=master)](https://travis-ci.org/wix/react-native-calendars)

Este package inclui vários componentes de calendário nativos personalizáveis.

Este package é compativél com ambos **Android** and **iOS**.

## Experimente

Voçê pode correr exte módulo seguindo os seguintes passos:

```
$ git clone git@github.com:wix/react-native-calendars.git
$ npm install
$ react-native run-ios
```

Você pode verificar o código-fonte das telas de exemplo em [telas de exemplo](https://github.com/wix-private/wix-react-native-calendar/tree/master/example/src/screens)

Este projeto é compatível com a Expo/CRNA (sem ejeção), e os exemplos foram [publicados no site da Expo](https://expo.io/@community/react-native-calendars-example)

## Instalação

```
$ npm install --save react-native-calendars
```

A solução é implementada em JavaScript, portanto, não é necessário conectar o módulo nativo.

## Usage

`import {`[Calendar](#calendar), [CalendarList](#calendarlist), [Agenda](#agenda)`} from 'react-native-calendars';`

Todos os parâmetros para componentes são opcionais. Por padrão, o mês da data local atual será exibido.

Os retornos de chamada do manipulador de eventos são chamados com `objetos de calendário` como este
:

```javasctipt
{
  day: 1,     // dia do mês (1-31)
  month: 1,   // mês do ano (1-12)
  year: 2017, // ano
  timestamp,   // Registro de data e hora UTC que representa 00:00 desta data
  dateString: '2016-05-13' // data formatada com a sequência 'YYYY-MM-DD'
}
```

Os parâmetros que requerem tipos de data aceitam sequências de dados formatadas YYYY-MM-DD, objetos de data JavaScript, `objetos de calendário` e UTC timestamps.

Os calendários podem ser localizados adicionando localizações personalizadas ao objeto `LocaleConfig`:

```javascript
import { LocaleConfig } from "react-native-calendars";

LocaleConfig.locales["fr"] = {
  monthNames: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre"
  ],
  monthNamesShort: [
    "Janv.",
    "Févr.",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juil.",
    "Août",
    "Sept.",
    "Oct.",
    "Nov.",
    "Déc."
  ],
  dayNames: [
    "Dimanche",
    "Lundi",
    "Mardi",
    "Mercredi",
    "Jeudi",
    "Vendredi",
    "Samedi"
  ],
  dayNamesShort: ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."],
  today: "Aujourd'hui"
};
LocaleConfig.defaultLocale = "fr";
```

### Calendar

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/calendar.gif?raw=true">
</kbd>

#### Parâmetros básicos

```javascript
<Calendar
  //Mês inicialmente visível. Padrão = Date()
  current={"2012-03-01"}
  // A data mínima que pode ser selecionada, as datas antes de minDate ficarão acinzentadas. Padrão = undefined
  minDate={"2012-05-10"}
  // Data máxima que pode ser selecionada, as datas após maxDate ficarão acinzentadas. Padrão = undefined
  maxDate={"2012-05-30"}
  // Manipulador que é executado no dia clicado. Padrão = undefined
  onDayPress={day => {
    console.log("selected day", day);
  }}
  // Manipulador que é executado no dia clicado por longo tempo. Padrão = undefined
  onDayLongPress={day => {
    console.log("selected day", day);
  }}
  // Formato do mês no título do calendário. Formatação de valores: http://arshaw.com/xdate/#Formatting
  monthFormat={"yyyy MM"}
  // Manipulador que é executado quando o mês visível muda no calendário. Padrão = undefined
  onMonthChange={month => {
    console.log("month changed", month);
  }}
  // Ocultar setas de navegação do mês. Padrão = false
  hideArrows={true}
  // Substitua as setas padrão pelas personalizadas (a direção pode ser 'esquerda' ou 'direita')
  renderArrow={direction => <Arrow />}
  // Não mostrar dias de outros meses na página do mês. Padrão = false
  hideExtraDays={true} // dia de outro mês visível na página do calendário. Padrão = false
  // Se hideArrows = false e hideExtraDays = false não mudam de mês ao tocar em cinza
  disableMonthChange={true}
  // Se firstDay = 1 semana começa a partir de segunda-feira. Observe que dayNames e dayNamesShort ainda devem começar a partir de domingo.
  firstDay={1}
  // Ocultar nomes dos dias. Padrão = false
  hideDayNames={true}
  // Mostrar números da semana à esquerda. Padrão = false
  showWeekNumbers={true}
  // Manipulador que é executado quando o ícone de seta é pressionado à esquerda. Receber um retorno de chamada pode voltar no mês
  onPressArrowLeft={substractMonth => substractMonth()}
  // Manipulador que é executado quando o ícone de seta é pressionado à esquerda. Ele recebe um retorno de chamada pode ir no próximo mês
  onPressArrowRight={addMonth => addMonth()}
/>
```

#### Marcação da data

**!Aviso!** Certifique-se de que o parâmetro `taggedDates` seja imutável. Se você alterar o conteúdo do objeto `selectedDates`, mas a referência a ele não mudar, a atualização do calendário não será acionada.

Marcação de pontos

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking1.png?raw=true">
</kbd>

```javascript
<Calendar
  // Coleção de datas que precisam ser marcadas
 = {}
  markedDates={{
    "2012-05-16": { selected: true, marked: true, selectedColor: "blue" },
    "2012-05-17": { marked: true },
    "2012-05-18": { marked: true, dotColor: "red", activeOpacity: 0 },
    "2012-05-19": { disabled: true, disableTouchEvent: true }
  }}
/>
```

Você pode personalizar uma cor de ponto para cada dia de forma independente.

Marcação multiponto

<kbd>
 <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking4.png?raw=true">
</kbd>

Use markingType = 'multi-dot' se desejar exibir mais de um ponto. O controle Calendar e CalendarList oferecem suporte a vários pontos usando a matriz 'dots' em selectedDates. A propriedade 'color' é obrigatória, enquanto 'key' e 'selectedColor' são opcionais. Se a chave for omitida, o índice da matriz será usado como chave. Se selectedColor for omitido, 'color' será usado para as datas selecionadas.

```javascript
const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" };
const massage = { key: "massage", color: "blue", selectedDotColor: "blue" };
const workout = { key: "workout", color: "green" };

<Calendar
  markedDates={{
    "2017-10-25": {
      dots: [vacation, massage, workout],
      selected: true,
      selectedColor: "red"
    },
    "2017-10-26": { dots: [massage, workout], disabled: true }
  }}
  markingType={"multi-dot"}
/>;
```

Marcação do período

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking2.png?raw=true">
</kbd>

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking3.png?raw=true">
</kbd>

```javascript
<Calendar
  // Coleção de datas que precisam ser coloridas de uma maneira especial. Padrão = {}
  markedDates={{
    "2012-05-20": { textColor: "green" },
    "2012-05-22": { startingDay: true, color: "green" },
    "2012-05-23": {
      selected: true,
      endingDay: true,
      color: "green",
      textColor: "gray"
    },
    "2012-05-04": {
      disabled: true,
      startingDay: true,
      color: "green",
      endingDay: true
    }
  }}
  // Estilos de marcação de data [simple/period/multi-dot/custom]. Padrão = 'simple'
  markingType={"period"}
/>
```

Marcação de vários períodos

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/marking6.png?raw=true">
</kbd>

CUIDADO: Esta marcação é totalmente suportada pelo componente `<Calendar />` porque expande sua altura. O uso com `<CalendarList />` pode levar a problemas de overflow.

```javascript
<Calendar
  markedDates={{
    "2017-12-14": {
      periods: [
        { startingDay: false, endingDay: true, color: "#5f9ea0" },
        { startingDay: false, endingDay: true, color: "#ffa500" },
        { startingDay: true, endingDay: false, color: "#f0e68c" }
      ]
    },
    "2017-12-15": {
      periods: [
        { startingDay: true, endingDay: false, color: "#ffa500" },
        { color: "transparent" },
        { startingDay: false, endingDay: false, color: "#f0e68c" }
      ]
    }
  }}
  // Estilos de marcação de data [simple/period/multi-dot/custom]. Padrão = 'simple'
  markingType="multi-period"
/>
```

A marcação personalizada permite personalizar cada marcador com estilos personalizados.

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/custom.png?raw=true">
</kbd>

```javascript
<Calendar
  // stilos de marcação de data [simple/period/multi-dot/single]. Padrão = 'simple'
  markingType={"custom"}
  markedDates={{
    "2018-03-28": {
      customStyles: {
        container: {
          backgroundColor: "green"
        },
        text: {
          color: "black",
          fontWeight: "bold"
        }
      }
    },
    "2018-03-29": {
      customStyles: {
        container: {
          backgroundColor: "white",
          elevation: 2
        },
        text: {
          color: "blue"
        }
      }
    }
  }}
/>
```

Lembre-se de que diferentes tipos de marcação não são compatíveis. Você pode usar apenas um estilo de marcação para o calendário.

#### Exibindo o indicador de carregamento de dados

<kbd>
  <img height=50 src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/loader.png?raw=true">
</kbd>

O indicador de carregamento próximo ao nome do mês será exibido se `<Calendar />` tiver a propriedade `displayLoadingIndicator` e a coleção`selectedDates` não tiver um valor para todos os dias do mês em questão. Quando você carrega dados por dias, apenas defina `[]` ou valor de marcação especial para todos os dias na coleção `selectedDates`.

#### Personalizando a aparência

```javascript
<Calendar
  // Especificar estilo para o elemento de contêiner de calendário. Padrão = {}
  style={{
    borderWidth: 1,
    borderColor: "gray",
    height: 350
  }}
  // Especifique propriedades do tema para substituir estilos específicos para partes do calendário. Padrão = {}
  theme={{
    backgroundColor: "#ffffff",
    calendarBackground: "#ffffff",
    textSectionTitleColor: "#b6c1cd",
    selectedDayBackgroundColor: "#00adf5",
    selectedDayTextColor: "#ffffff",
    todayTextColor: "#00adf5",
    dayTextColor: "#2d4150",
    textDisabledColor: "#d9e1e8",
    dotColor: "#00adf5",
    selectedDotColor: "#ffffff",
    arrowColor: "orange",
    monthTextColor: "blue",
    indicatorColor: "blue",
    textDayFontFamily: "monospace",
    textMonthFontFamily: "monospace",
    textDayHeaderFontFamily: "monospace",
    textDayFontWeight: "300",
    textMonthFontWeight: "bold",
    textDayHeaderFontWeight: "300",
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 16
  }}
/>
```

#### Advanced styling

Se você deseja ter controle completo sobre os estilos de calendário, pode fazê-lo substituindo os arquivos style.js padrão. Por exemplo, se você deseja substituir o estilo do cabeçalho da agenda primeiro, precisa encontrar o id da stylesheet para este arquivo:

https://github.com/wix/react-native-calendars/blob/master/src/calendar/header/style.js#L4

In this case it is 'stylesheet.calendar.header'. Next you can add overriding stylesheet to your theme with this id.
Nesse caso, é 'stylesheet.calendar.header'. Em seguida, você pode adicionar uma stylesheet substituta ao seu tema com esse id.

https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js#L56

```javascript
theme={{
  arrowColor: 'white',
  'stylesheet.calendar.header': {
    week: {
      marginTop: 5,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }
}}
```

**Aviso**: os problemas que surgem porque algo quebra após o uso da stylesheet não são suportados. Use esta opção por seu próprio risco.

#### Substituindo o componente do dia

Se você precisar de funcionalidade personalizada não suportada pelas implementações de componentes do dia atual, poderá passar seu próprio dia personalizado componente para o calendário.

```javascript
<Calendar
  style={[styles.calendar, { height: 300 }]}
  dayComponent={({ date, state }) => {
    return (
      <View style={{ flex: 1 }}>
        <Text
          style={{
            textAlign: "center",
            color: state === "disabled" ? "gray" : "black"
          }}
        >
          {date.day}
        </Text>
      </View>
    );
  }}
/>
```

O suporte dayComponent precisa receber um componente ou função RN que recebe `props`. O componente dia receberá esses `props`:

- state - disabled se o dia deve ser desativado (isso é decidido pelo componente base do calendário)
- marking - selectedDates valor para este dia
- date - o objeto de data que representa este dia

**Dica:** Não se esqueça de implementar shouldComponentUpdate para seu componente de dia personalizado para melhorar o desempenho do calendário

Se você implementar um componente impressionante do dia, faça um PR para que outras pessoas possam usá-lo :)

### CalendarList

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/calendar-list.gif?raw=true">
</kbd>

`<CalendarList />` é um calendário semi-infinito rolável composto por componentes `<Calendar />`. Atualmente, é possível rolar 4 anos para trás e 4 anos para o futuro. Todos os parâmetros disponíveis para `<Calendar />` também estão disponíveis para este componente. Existem também alguns parâmetros adicionais que podem ser usados:

```javascript
<CalendarList
  // Retorno de chamada que é executado quando os meses visíveis mudam na scroll view. Padrão = undefined
  onVisibleMonthsChange={(months) => {console.log('now these months are visible', months);}}
  //Quantidade máxima de meses permitidos para rolar para o passado. Padrão = 50
  pastScrollRange={50}
  // Quantidade máxima de meses permitidos para rolar para o futuro. Padrão = 50
  futureScrollRange={50}
  // Ativar ou desativar o scroll da lista de agendas
  scrollEnabled={true}
  // Ativar ou desativar o indicador de scroll vertical. Padrão = false
  showScrollIndicator={true}
  ...calendarParams
/>
```

#### Horizontal CalendarList

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/horizontal-calendar-list.gif?raw=true">
</kbd>

You can also make the `CalendarList` scroll horizontally. To do that you need to pass specific props to the `CalendarList`:

```javascript
<CalendarList
  // Activar scroll horizontal, Padrão = false
  horizontal={true}
  // Activar paginação no scroll horizontal, Padrão = false
  pagingEnabled={true}
  // Defina a largura do calendário personalizado.
  calendarWidth={320}
  ...calendarListParams
  ...calendarParams
/>
```

### Agenda

<kbd>
  <img src="https://github.com/wix-private/wix-react-native-calendar/blob/master/demo/agenda.gif?raw=true">
</kbd>

Um componente avançado que pode exibir listagens interativas para itens do dia do calendário.

```javascript
<Agenda // o valor da chave de data kas como uma matriz vazia []. Se não houver valor para a chave da data, é // considere a data em questão ainda não foi carregada
  // a lista de itens que precisam ser exibidos na agenda. Se você deseja processar o item como data vazia
  items={{
    "2012-05-22": [{ text: "item 1 - any js object" }],
    "2012-05-23": [{ text: "item 2 - any js object" }],
    "2012-05-24": [],
    "2012-05-25": [
      { text: "item 3 - any js object" },
      { text: "any js object" }
    ]
  }}
  // retorno de chamada que é chamado quando itens de um determinado mês devem ser carregados (o mês ficou visível)
  loadItemsForMonth={month => {
    console.log("trigger items loading");
  }}
  // retorno de chamada que é acionado quando o calendário é aberto ou fechado
  onCalendarToggled={calendarOpened => {
    console.log(calendarOpened);
  }}
  // retorno de chamada que é chamado no dia selecionado
  onDayPress={day => {
    console.log("day pressed");
  }}
  // retorno de chamada que é chamado quando o dia muda enquanto rola a lista de agendas
  onDayChange={day => {
    console.log("day changed");
  }}
  // dia inicialmente selecionado
  selected={"2012-05-16"}
  // A data mínima que pode ser selecionada, as datas antes de minDate ficarão acinzentadas. Padrão = undefined
  minDate={"2012-05-10"}
  // Data máxima que pode ser selecionada, as datas após maxDate ficarão acinzentadas. Padrão = undefined
  maxDate={"2012-05-30"}
  // Quantidade máxima de meses permitidos para rolar para o passado. Padrão = 50
  pastScrollRange={50}
  // Quantidade máxima de meses permitidos para rolar para o futuro. Padrão = 50
  futureScrollRange={50}
  // especificar como cada item deve ser renderizado na agenda
  renderItem={(item, firstItemInDay) => {
    return <View />;
  }}
  // especifica como cada data deve ser renderizada. dia pode ser indefinido se o item não for o primeiro naquele dia.
  renderDay={(day, item) => {
    return <View />;
  }}
  // especifica como o conteúdo da data vazia sem itens deve ser renderizado
  renderEmptyDate={() => {
    return <View />;
  }}
  // especifica como o botão da agenda deve se parecer
  renderKnob={() => {
    return <View />;
  }}
  // especifica o que deve ser renderizado em vez de ActivityIndicator
  renderEmptyData={() => {
    return <View />;
  }}
  // especifica sua função de comparação de itens para aumentar o desempenho
  rowHasChanged={(r1, r2) => {
    return r1.text !== r2.text;
  }}
  // Ocultar botão. Padrão = false
  hideKnob={true}
  // Por padrão, as datas da agenda são marcadas se tiverem pelo menos um item, mas você pode substituí-lo, se necessário
  markedDates={{
    "2012-05-16": { selected: true, marked: true },
    "2012-05-17": { marked: true },
    "2012-05-18": { disabled: true }
  }}
  // Se fornecido, um RefreshControl padrão será adicionado para a funcionalidade "Puxar para atualizar". Certifique-se de definir também o suporte de atualização corretamente.
  onRefresh={() => console.log("refreshing...")}
  // Defina como verdadeiro enquanto aguarda novos dados de uma atualização
  refreshing={false}
  // Adicione um componente RefreshControl personalizado, usado para fornecer a funcionalidade pull-to-refresh para o ScrollView.
  refreshControl={null}
  // tema da agenda
  theme={{
    ...calendarTheme,
    agendaDayTextColor: "yellow",
    agendaDayNumColor: "green",
    agendaTodayColor: "red",
    agendaKnobColor: "blue"
  }}
  // estilo do contêiner da agenda
  style={{}}
/>
```

## Autores

- [Tautvilas Mecinskas](https://github.com/tautvilas/) - Código inicial - [@tautvilas](https://twitter.com/TautviIas)
- Katrin Zotchev - Design inicial - [@katrin_zot](https://twitter.com/katrin_zot)

Veja também a lista de [colaboradores](https://github.com/wix/react-native-calendar-components/contributors) que participaram deste projeto.

## Contribuir

Pull requests são bem-vindas. `npm run test` e`npm run lint` antes do envio.
