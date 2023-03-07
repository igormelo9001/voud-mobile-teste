// NPM imports
import React, { Component } from "react";
import { connect } from "react-redux";

import { StyleSheet, View, ScrollView, Image } from "react-native";
import LinearGradient from "react-native-linear-gradient";

// VouD imports

import { colors } from "../../../styles";
import Header, { headerActionTypes } from "../../../components/Header";
import SystemText from "../../../components/SystemText";
import VoudText from "../../../components/VoudText";
import { saveItem } from "../../../utils/async-storage";
import { asyncStorageKeys } from "../../../redux/init";
import Button from "../../../components/Button";

const logoScoo = require('../../../images/logo-scoo.png');

class ScooterUsageTermsView extends Component {
  _close = () => {
    this.props.onPressClose();
  };

  _handlerAcceptTermUsage = async () => {
    await saveItem(asyncStorageKeys.scooterAcceptUsageTerms, "true");
    this.props.onPressAcceptTerms();
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Header
          title="Termo de Uso"
          left={{
            type: headerActionTypes.CLOSE,
            onPress: this._close
          }}
        />
        <ScrollView>
          <View style={styles.constainer}>
          <View style={styles.logoScoo}>
            <Image source={logoScoo} />
          </View>
            <SystemText style={styles.title}>
              Termos de Uso SCOO MOBILIDADE LTDA
            </SystemText>
          </View>
          <View style={styles.containerDescription}>
            <SystemText style={styles.titleBold}>1. INTRODUÇÃO</SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>1.1.</SystemText> O presente
              Termo de Uso (“Termo”) determina a relação entre o “Usuário” e o
              Serviço de locação e compartilhamento de patinetes elétricos
              (“Serviço”) oferecido pela SCOO MOBILIDADE LTDA do{" "}
              <SystemText style={styles.titleBold}>CNPJ/MF</SystemText> sob o
              <SystemText style={styles.titleBold}>
                nº 31.362.447/0001-34
              </SystemText>
              .
            </SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>1.2. </SystemText>O Usuário,
              desde já, e previamente à utilização dos Serviços, reconhece e
              declara que leu, entendeu e concorda com o conteúdo deste Termo e
              da Política de Privacidade da SCOO MOBILIDADE LTDA, devendo marcar
              a opção "concordo/aceito" no ícone abaixo correspondente.
            </SystemText>
          </View>

          <View style={styles.containerDescription}>
            <SystemText style={styles.titleBold}>2. DAS DEFINIÇÕES</SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>2.1. </SystemText>O presente
              Termo possui as seguintes definições: Aplicativo: programa
              (software) baixado e instalado nos aparelhos celulares dos
              USUÁRIOS, com a finalidade de utilizar o serviço oferecido pela
              SCOO MOBILIDADE LTDA, Conta: espaço virtual de acesso exclusivo do
              Usuário por meio de Login e senha, previamente cadastrados no site
              ou aplicativo; Pontos de locação: equipamentos onde os patinetes
              ficam disponíveis para retirada e devolução pelo Usuários; Site:
              ambiente virtual em que são disponibilizadas diversas informações
              para o Usuário; Usuário: pessoa física,{" "}
              <SystemText style={styles.titleBold}>maior de 18 anos</SystemText>
              , com capacidade plena, que ao concordar com o{" "}
              <SystemText style={styles.titleBold}>
                Termo de Uso e a Política de Privacidade
              </SystemText>{" "}
              da SCOO MOBILIDADE LTDA., realiza o acesso ao site ou aplicativo,
              mediante senha pessoal e Login. SAU: Serviço de atendimento ao
              USUÁRIO SCOO MOBILIDADE LTDA.
            </SystemText>
          </View>

          <View style={styles.containerDescription}>
            <SystemText style={styles.titleBold}>
              3. CADASTRO DOS USUÁRIOS
            </SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.1.</SystemText> A SCOO
              MOBILIDADE LTDA, disponibilizará ao USUÁRIO, à título de locação,
              os patinetes elétricos, conforme às condições previstas no
              presente TERMO, mediante prévio cadastramento no formulário e
              aplicativo disponibilizados no site.
            </SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.2.</SystemText> A
              disponibilização do patinete ao USUÁRIO depende, obrigatoriamente,
              do preenchimento do cadastro no Apicativo SCOO Mobi. A SCOO
              MOBILIDADE LTDA se resguarda ao direito de solicitar ao usuário
              documento para conferência de informações no ato da retirada da
              patinete.
            </SystemText>

            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.3.</SystemText> O Usuário
              para se cadastrar necessita criar um login e senha e após
              preencher o formulário disponível no site com seus dados pessoais
              e do cartão de crédito.
            </SystemText>

            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.4. </SystemText>
              As informações fornecidas pelo USUÁRIO em seu cadastro deverão ser
              verídicas e atualizadas, caso seja constatada qualquer
              irregularidade a SCOO MOBILIDADE LTDA. poderá suspender a
              prestação do serviço ou até mesmo excluir o USUÁRIO de seu
              cadastro.
            </SystemText>

            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.5.</SystemText> Os
              patinetes estarão disponíveis em pontos de locação fixos e móveis
              que podem ser identificados no aplicativo. O horário de
              funcionamento é:{" "}
              <SystemText style={styles.titleBold}>
                Segunda a Sexta das 7:00
              </SystemText>{" "}
              às{" "}
              <SystemText style={styles.titleBold}>
                19:00 horas ( por motivo de segurança não teremos
                disponibilidade em dias de chuva ).
              </SystemText>{" "}
              Os horários poderão ser alterados sem prévio aviso, devido ao
              término de bateria dos equipamentos.
            </SystemText>

            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.6.</SystemText> A SCOO
              MOBILIDADE LTDA. se reserva o direito de suspender a locação dos
              patinetes em virtude de ocorrências de caso fortuito e/ou força
              maior, ou ainda, quando for necessária a manutenção dos
              componentes e outros equipamentos, os quais ocasionem a
              impossibilidade de utilização dos patinetes ou falta de segurança
              ao USUÁRIO.
            </SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.7.</SystemText>O USUÁRIO
              deverá realizar o pagamento para a utilização do patinete através
              do cartão de crédito previamente cadastrado no site e no
              aplicativo. e o valor a ser cobrado será de{" "}
              <SystemText style={styles.titleBold}>
                R$ 4,30 (quatro reais e trinta centavos)
              </SystemText>{" "}
              para sua liberação com franquia de 15 minutos e
              <SystemText style={styles.titleBold}>
                {" "}R$0,45 (quarenta e cinco centavos)
              </SystemText>{" "}
              por minuto de utilização
            </SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.8.</SystemText> O USUÁRIO
              poderá retirar e devolver o patinete e o capacete em qualquer
              ponto de locação, garantindo que o vistoriou antes da retirada e
              ao devolvê-lo, certificando-se que se encontra em perfeitas
              condições de uso. Comprometendo-se a conservar o patinete, durante
              a sua utilização, na forma como recebeu, respondendo pelo uso
              indevido, bem como pelas perdas e danos decorrentes, inclusive
              ocasionada a terceiros.
            </SystemText>
            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.9. </SystemText>
              Caso o patinete venha a apresentar alguma avaria durante sua
              utilização, o USUÁRIO deverá entrar em contato com o SAU, através
              do telefone{" "}
              <SystemText style={styles.titleBold}>(11) 976373479</SystemText>,
              a fim de devolver o patinete quando da chegada do representante
              credenciado, caso não consiga entregar em um ponto de locação mais
              próximo.
            </SystemText>

            <SystemText style={styles.text}>
              <SystemText style={styles.titleBold}>3.10.</SystemText> Caso seja
              constatada a má utilização por parte do USUÁRIO, o mesmo poderá
              ter seu cadastro suspenso e responderá pelas perdas no valor de R$
              2.500,00 ( dois mil e quinhentos ) e danos causados.
            </SystemText>

            <View style={{ marginTop: 8 }}>
              <SystemText style={styles.titleBold}>
                4. DECLARAÇÕES DO USUÁRIO O USUÁRIO está ciente que:
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}> i) </SystemText>
                os patinetes são destinados somente para o uso individual;
              </SystemText>
              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>ii) </SystemText>
                não deverá realizar em qualquer hipótese corridas com outro{" "}
                <SystemText style={styles.titleBold}>USUÁRIO</SystemText> ou
                realizar manobras arriscadas;
              </SystemText>
              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>iii) </SystemText>é
                expressamente proibido a utilização de aparelho celular ou
                qualquer outro dispositivo eletrônico, incluindo fones de ouvido
                quando estiver utilizando o patinete;
              </SystemText>
              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>iv) </SystemText>
                não utilizará o patinete sob efeito de álcool, drogas ou
                qualquer outra substância que viole o Código Brasileiro de
                Trânsito ou qualquer outra legislação, nem carregará volumes que
                possam causar danos a terceiros;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>v) </SystemText>
                não retirará ou modificará qualquer acessório, parte e/ou
                componente do patinete;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>vi) </SystemText> deverá
                deverá utilizar obrigatoriamente o capacete;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>vii) </SystemText>o uso
                inadequado do patinete, isenta a SCOO MOBILIDADE LTDA. de
                qualquer responsabilidade civil, penal, administrativa ou em
                qualquer outra esfera;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>viii) </SystemText>é de sua
                única e inteira responsabilidade o patinete durante utilização,
                sendo proibido, emprestar, sublocar, doar, vender;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>ix) </SystemText>a idade
                mínima para utilização do patinete é de{" "}
                <SystemText style={styles.titleBold}>18 anos</SystemText>;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>x) </SystemText>a SCOO
                MOBILIDADE LTDA. não se responsabiliza por qualquer dano físico
                ou material causado a si ou a terceiros durante o uso do
                patinete;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>xi) </SystemText> deverá
                comunicar imediatamente o SAU e seguir as orientações fornecidas
                pela SCOO MOBILIDADE LTDA., caso venha a sofrer qualquer dano
                físico comprovadamente ocasionado por suposta falha no patinete,
                para que possa ser dado o suporte necessário;
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}> xii) </SystemText>
                em caso de ocorrência de furto ou roubo do patinete, deverá ser
                informado imediatamente o SAU, bem como apresentar no prazo de
                24 horas o respectivo boletim de ocorrência, sob a pena de ser
                cobrado o valor integral do patinete.
              </SystemText>
            </View>

            <View style={{ marginTop: 8 }}>
              <SystemText style={styles.titleBold}>
                5. DAS DISPOSIÇÕES GERAIS
              </SystemText>
              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.1. </SystemText>O presente
                Termo permanecerá em vigor por prazo indeterminado.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.2. </SystemText>O USUÁRIO
                reconhece que todo o conteúdo do site e do aplicativo, é
                protegido pela{" "}
                <SystemText style={styles.titleBold}>Lei 9.610/98</SystemText>,
                razão pela qual se obriga a utilizar os serviços apenas para
                fins de consulta, sendo expressamente vedada a utilização para
                quaisquer outros fins, sem prévia e expressa autorização.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.3. </SystemText>O USUÁRIO
                terá direito a uma licença limitada, não exclusiva, sem direito
                a sublicenciamento e à transferência de acesso e uso para{" "}
                <SystemText style={styles.titleBold}>(i)</SystemText>
                acessar e usar o App em seu dispositivo móvel; e{" "}
                <SystemText style={styles.titleBold}>(ii)</SystemText> acessar e
                usar qualquer conteúdo, informação e materiais relacionados aos
                Patinetes, exclusivamente, para seu uso pessoal e não comercial.
                Quaisquer outros direitos aqui não mencionados são reservados à
                SCOO MOBILIDADE LTDA.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.4. </SystemText>A qualquer
                tempo o USUÁRIO poderá acessar o site e solicitar o cancelamento
                de seu cadastro, desde que não possua obrigações assumidas
                quando da adesão e contempladas neste Termo.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.5. </SystemText>A SCOO
                MOBILIDADE LTDA reserva-se o direito de modificar o presente
                Termo a qualquer momento, com prévia comunicação abrangente aos
                Usuários, os quais deverão acompanhar as atualizações e
                informar-se sobre o seu conteúdo regularmente. Eventuais
                alterações não dependerão de nova aceitação, passando a serem
                aplicadas de modo automático.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.6. </SystemText>A
                tolerância da SCOO MOBILIDADE LTDA. em relação a quaisquer das
                condições aqui previstas, não representará novação ou renúncia
                de direitos, caracterizando-se exclusivamente como mera
                liberalidade.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.7. </SystemText>O USUÁRIO
                declara, neste ato, que compreendeu o objeto do presente Termo e
                tem plena ciência de todas as condições ora pactuadas,
                declarando ser capacitada para a consecução de suas obrigações.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.8. </SystemText>
                Se qualquer uma das disposições do presente Termo vier a
                tornar-se nula ou revelar-se omissa, tal nulidade ou omissão não
                afetará a validade das demais disposições aqui contidas.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>5.9.</SystemText> Este
                Termo obriga o USUÁRIO e seus sucessores a qualquer título.
              </SystemText>

              <SystemText style={styles.text}>
                <SystemText style={styles.titleBold}>6.</SystemText> DO FORO
                Fica eleito o foro da Comarca de  <SystemText style={styles.titleBold}>São Paulo\SP</SystemText>, para dirimir
                quaisquer dúvidas ou controvérsias decorrentes do presente
                Termo, excluindo-se qualquer outro, por mais privilegiado que
                seja.
              </SystemText>
            </View>
            <View style={styles.containerButton}>
              <Button
                onPress={this._handlerAcceptTermUsage}
                style={styles.button}
              >
                Aceitar termo de uso
              </Button>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

// Styles
const styles = StyleSheet.create({
  constainer: {
    alignItems: "center",
    padding: 5,
    marginTop: 16
  },
  title: {
    fontSize: 15,
    color: colors.GRAY_DARK,
    fontWeight: "bold"
  },
  containerDescription: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16
  },
  titleBold: {
    fontWeight: "bold",
    color: colors.GRAY_DARK
  },
  text: {
    color: colors.GRAY_DARK,
    marginTop: 8
  },
  termsText: {
    color: "white",
    textAlign: "left"
  },
  hyperlink: {
    color: colors.BRAND_SECONDARY,
    textDecorationLine: "underline"
  },
  button: {
    // marginTop: 24
  },
  containerButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20
  },
  logoScoo :{
    flex:1,
    flexDirection: 'row',
    alignItems:"center",
    justifyContent:"center",
    padding: 10,
  }
});

export default ScooterUsageTermsView;
// export const ScooterUsageTerms = connect()(ScooterUsageTermsView);

