# Experimento Stroop: Dinâmica Contextual Sequencial

<div align="center">

![UFPA](https://img.shields.io/badge/UFPA-ITEC-blue?style=for-the-badge)
![LaPS](https://img.shields.io/badge/LaPS-Laboratório_de_Processamento_de_Sinais-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Ativo-success?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Investigação da Dependência Histórica e Contextualidade em Processos Cognitivos**

[Sobre](#sobre) • [Fundamentação](#fundamentação-teórica) • [Tecnologia](#tecnologia) • [Instalação](#instalação) • [Uso](#uso) • [Dados](#estrutura-dos-dados) • [Equipe](#equipe-de-pesquisa) • [Ética](#aspectos-éticos) • [Citação](#como-citar)

</div>

---

## 📋 Sobre

Este repositório contém a implementação de um **experimento cognitivo tipo Stroop** desenvolvido para investigar a **dinâmica contextual sequencial** em processos de tomada de decisão perceptual. O estudo é parte de um programa de pesquisa mais amplo sobre cognição contextual e dependência histórica em sistemas cognitivos, com inspiração em modelos teóricos de contextualidade.

O experimento é executado inteiramente online através de uma interface web, permitindo coleta de dados remota e escalável, mantendo precisão temporal adequada para estudos de tempo de reação.

### 🎯 Objetivos

- **Primário**: Investigar como o contexto sequencial (história de trials anteriores) influencia o desempenho em tarefas de conflito perceptual
- **Secundário**: Quantificar a dependência histórica através de métricas de repetição (priming) e transição de estados
- **Exploratório**: Examinar se padrões de dependência contextual em cognição apresentam propriedades análogas a sistemas contextuais em outras áreas do conhecimento

---

## 🧠 Fundamentação Teórica

### Efeito Stroop e Controle Cognitivo

O **efeito Stroop** (Stroop, 1935) é um dos fenômenos mais replicados em psicologia experimental. Ele demonstra que nomear a cor da tinta de uma palavra interfere com a leitura automática da palavra, especialmente quando há incongruência (e.g., a palavra "VERMELHO" escrita em azul).

Este paradigma permite investigar:
- **Controle atencional**: Supressão de informação irrelevante (palavra) em favor da relevante (cor)
- **Automaticidade**: Processos que ocorrem sem controle voluntário
- **Conflito cognitivo**: Resolução de informações competitivas

### Dependência Sequencial e Contextualidade

Diferentemente de abordagens clássicas que tratam cada trial como independente e identicamente distribuído (i.i.d.), este experimento implementa:

1. **Efeito Gratton**: Modulação da interferência Stroop baseada na congruência do trial anterior (Gratton et al., 1992)
2. **Priming perceptual e semântico**: Facilitação/inibição causada por repetição de estímulos
3. **Adaptação contextual**: Ajuste dinâmico do sistema cognitivo ao fluxo de informação

### Inspiração em Modelos Quânticos de Cognição

Embora este experimento **não implemente simulações físicas quânticas**, ele é estruturado para permitir análises compatíveis com frameworks teóricos de **cognição quântica** (Busemeyer & Bruza, 2012; Pothos & Busemeyer, 2013), que propõem que:

- Estados cognitivos podem ser representados em espaços de Hilbert
- Medições (respostas) colapsam superposições de estados
- Ordem temporal de observações afeta resultados (não-comutatividade)
- Contexto modula a geometria do espaço de estados

**Variáveis implementadas para análise teórica**:
- `x`: Posição normalizada no bloco (0 a 1) - análoga a parâmetro temporal/espacial
- `prevCongruent`, `prevResponse`, `prevAccuracy`: História imediata - análoga a memória de estados
- `repetitionWord`, `repetitionColor`: Priming - análogo a interferência contextual

---

## 🛠️ Tecnologia

### Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5.x
- **Styling**: CSS Puro (sem frameworks)
- **Icons**: Lucide React
- **Deploy**: GitHub Pages (estático)
- **Backend**: Google Sheets API via Apps Script

### Por que esta Stack?

| Tecnologia | Justificativa Científica |
|------------|--------------------------|
| **React** | Componentes permitem controle preciso de renderização e estado |
| **TypeScript** | Tipagem estática previne erros em lógica experimental crítica |
| **Vite** | Build rápido e Hot Module Replacement para desenvolvimento ágil |
| **CSS Puro** | Controle total sobre rendering performance sem overhead de frameworks |
| **GitHub Pages** | Deploy gratuito, versionado e auditável |
| **Google Sheets** | Armazenamento estruturado acessível sem necessidade de servidor |

### Precisão Temporal

- **Marcação de tempo**: `performance.now()` (precisão ~1ms)
- **Deadline**: 2000ms para resposta
- **ITI variável**: 700-1300ms (uniformemente distribuído)
- **Fixação**: 800ms constante

---

## 🔬 Estrutura do Experimento

### Fases

```
1. Boas-vindas
   └─> Apresentação institucional e contextualização

2. Geração de Código Anônimo
   └─> Formato: [Iniciais]-[7 dígitos]
   └─> Exemplo: PS-5326594 (Pedro Silva)

3. Termo de Consentimento Livre e Esclarecido (TCLE)
   └─> Informações sobre: objetivos, procedimentos, riscos, benefícios
   └─> Download do termo em PDF

4. Instruções
   └─> Explicação da tarefa com exemplos visuais
   └─> Treino de resposta por teclado/botão

5. Bloco de Prática
   └─> 5 trials sem coleta de dados
   └─> Familiarização com timing e interface

6. Blocos Experimentais
   └─> 4 blocos × 20 trials = 80 trials totais
   └─> Pausa entre blocos (auto-paced)

7. Finalização
   └─> Agradecimento e feedback sobre envio de dados
   └─> Exibição do código do participante
   └─> Download opcional dos dados em JSON
```

### Design dos Trials

Cada trial segue a estrutura temporal:

```
[Fixação: +]  →  [Estímulo: PALAVRA em cor]  →  [ITI: tela vazia]
   800ms              até resposta ou 2000ms        700-1300ms
```

**Estímulos**:
- Palavras: `VERMELHO`, `VERDE`, `AZUL`
- Cores: vermelho (`#DC2626`), verde (`#16A34A`), azul (`#2563EB`)
- Distribuição: 50% congruentes, 50% incongruentes (randomizado)

**Respostas**:
- Teclado: `←` (Incongruente) | `→` (Congruente)
- Botões na tela para dispositivos touch

---

## 📊 Estrutura dos Dados

### Variáveis Coletadas por Trial

| Variável | Tipo | Descrição |
|----------|------|-----------|
| `timestamp` | ISO 8601 | Timestamp de recebimento no servidor |
| `participantId` | String | Código anônimo (XX-NNNNNNN) |
| `block` | Integer | Número do bloco (0-3) |
| `trialInBlock` | Integer | Posição no bloco (0-19) |
| `globalTrial` | Integer | Posição global (0-79) |
| `x` | Float | Posição normalizada no bloco (0.0-1.0) |
| `word` | String | Palavra apresentada |
| `color` | String | Cor da palavra (CSS color) |
| `congruent` | Boolean | Congruência palavra-cor |
| `response` | Boolean/Null | Resposta (true=congruente, false=incongruente, null=omissão) |
| `reactionTime` | Float | Tempo de reação em ms |
| `accuracy` | Boolean | Resposta correta |
| `omitted` | Boolean | Resposta omitida (deadline) |
| `prevCongruent` | Boolean/Null | Congruência do trial anterior |
| `prevResponse` | Boolean/Null | Resposta do trial anterior |
| `prevAccuracy` | Boolean/Null | Acurácia do trial anterior |
| `repetitionWord` | Boolean | Repetição da palavra |
| `repetitionColor` | Boolean | Repetição da cor |
| `trialTimestamp` | ISO 8601 | Timestamp do trial (cliente) |

### Formato de Exportação

**Google Sheets**: Linha por trial, colunas conforme tabela acima

**JSON** (download local):
```json
{
  "participantId": "PS-5326594",
  "data": [
    {
      "participantId": "PS-5326594",
      "block": 0,
      "trialInBlock": 0,
      "globalTrial": 0,
      "x": 0,
      "word": "VERMELHO",
      "color": "red",
      "congruent": true,
      "response": true,
      "reactionTime": 856.3,
      "accuracy": true,
      "omitted": false,
      "prevCongruent": null,
      "prevResponse": null,
      "prevAccuracy": null,
      "repetitionWord": false,
      "repetitionColor": false,
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

---

## 💻 Instalação

### Pré-requisitos

- **Node.js** ≥ 18.x ([Download](https://nodejs.org))
- **npm** ≥ 9.x (incluído com Node.js)
- **Git** ([Download](https://git-scm.com))
- Conta **Google** (para configuração do Google Sheets)
- Conta **GitHub** (para deploy)

### Passos

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/SEU-USUARIO/stroop-experiment-ufpa.git
   cd stroop-experiment-ufpa
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure a API do Google Sheets**:
   - Siga as instruções detalhadas em [`instrucoes.md`](./instrucoes.md)
   - Copie a URL do Apps Script gerada
   - Atualize `src/App.tsx` linha 47:
     ```typescript
     const GOOGLE_SCRIPT_URL = 'SUA-URL-AQUI';
     ```

4. **Execute localmente**:
   ```bash
   npm run dev
   ```
   Acesse: `http://localhost:5173`

5. **Build para produção**:
   ```bash
   npm run build
   ```

6. **Deploy no GitHub Pages**:
   - Siga as instruções em [`instrucoes.md`](./instrucoes.md) seção 2

---

## 🚀 Uso

### Para Participantes

1. Acesse o site do experimento (URL fornecida pelos pesquisadores)
2. Leia as informações iniciais e clique em **Iniciar**
3. Insira seu primeiro nome e sobrenome (apenas iniciais serão usadas)
4. Leia e aceite o **TCLE** (baixe uma cópia se desejar)
5. Leia as instruções com atenção
6. Complete o **treino** (5 tentativas)
7. Complete os **4 blocos experimentais** (80 tentativas no total)
8. Aguarde a confirmação de envio dos dados
9. **Anote seu código** se desejar contato futuro
10. Clique em **FINALIZAR** para encerrar

**Duração estimada**: 15-20 minutos

### Para Pesquisadores

#### Coleta de Dados

1. Compartilhe a URL do experimento com participantes
2. Monitore a planilha Google Sheets em tempo real
3. Dados são enviados automaticamente ao final de cada participação

#### Download dos Dados

**Google Sheets**:
```
Arquivo → Fazer download → CSV (planilha atual)
```

**JSON local** (cada participante pode baixar seus dados):
- Botão "Baixar Dados (JSON)" na tela final

#### Análise Recomendada

**R** (exemplo de análise contextual):
```r
library(tidyverse)

# Carregar dados
data <- read_csv("stroop_data.csv")

# Efeito Gratton
gratton <- data %>%
  filter(!is.na(prevCongruent)) %>%
  mutate(
    transition = case_when(
      prevCongruent & congruent ~ "cC",
      prevCongruent & !congruent ~ "cI",
      !prevCongruent & congruent ~ "iC",
      !prevCongruent & !congruent ~ "iI"
    )
  ) %>%
  group_by(transition) %>%
  summarise(
    mean_rt = mean(reactionTime, na.rm = TRUE),
    accuracy = mean(accuracy)
  )

print(gratton)
```

**Python** (exemplo de análise de priming):
```python
import pandas as pd
import numpy as np

# Carregar dados
df = pd.read_csv('stroop_data.csv')

# Análise de priming
priming = df.groupby(['repetitionWord', 'repetitionColor']).agg({
    'reactionTime': ['mean', 'std'],
    'accuracy': 'mean'
}).round(2)

print(priming)
```

---

## 📁 Estrutura do Projeto

```
stroop-experiment-ufpa/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD para GitHub Pages
├── src/
│   ├── App.tsx                 # Componente principal (lógica experimental)
│   ├── main.tsx                # Ponto de entrada React
│   ├── index.css               # Estilos globais
│   └── styles.css              # Estilos do experimento
├── index.html                  # HTML raiz
├── vite.config.ts              # Configuração Vite
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências e scripts
├── instrucoes.md               # Instruções detalhadas de deploy
└── README.md                   # Este arquivo
```

---

## 👥 Equipe de Pesquisa

### Pesquisador Responsável

**José Antônio Amador**  
Laboratório de Processamento de Sinais (LaPS)  
Instituto de Tecnologia (ITEC)  
Universidade Federal do Pará (UFPA)  
📧 jose.amador@ntpc.ufpa.br

### Orientador

**Prof. Dr. Antonio Pereira Júnior**  
Laboratório de Processamento de Sinais (LaPS)  
Instituto de Tecnologia (ITEC)  
Universidade Federal do Pará (UFPA)

### Instituição

**Universidade Federal do Pará (UFPA)**  
Instituto de Tecnologia (ITEC)  
Laboratório de Processamento de Sinais (LaPS)  
Belém, Pará, Brasil

---

## 🔒 Aspectos Éticos

### Aprovação Ética

Este estudo foi **aprovado pelo Comitê de Ética em Pesquisa da UFPA** sob o parecer nº **8.085.208**.

### Proteção dos Participantes

- **Anonimato**: Código gerado não permite identificação pessoal
- **Voluntariedade**: Participação completamente voluntária, sem compensação
- **Desistência**: Possibilidade de abandono a qualquer momento sem penalidades
- **Riscos mínimos**: Possível cansaço visual leve (comparável a uso recreativo de telas)
- **TCLE**: Termo disponível para leitura e download antes da participação

### Gestão de Dados

- **Armazenamento**: Google Sheets com acesso restrito aos pesquisadores
- **Backup**: Recomenda-se backup periódico em servidor institucional
- **Prazo de retenção**: Conforme diretrizes da UFPA e legislação brasileira
- **Compartilhamento**: Dados agregados podem ser compartilhados em publicações científicas

### Direitos dos Participantes

Participantes têm direito a:
- Solicitar esclarecimentos sobre a pesquisa
- Requerer cópia de seus dados (através do código de participante)
- Solicitar exclusão de seus dados (através do código de participante)
- Contatar o Comitê de Ética em Pesquisa da UFPA

**Contato para exercício de direitos**: jose.amador@ntpc.ufpa.br

---

## 📚 Referências Fundamentais

1. **Stroop, J. R.** (1935). Studies of interference in serial verbal reactions. *Journal of Experimental Psychology*, 18(6), 643–662.

2. **Gratton, G., Coles, M. G. H., & Donchin, E.** (1992). Optimizing the use of information: Strategic control of activation of responses. *Journal of Experimental Psychology: General*, 121(4), 480–506.

3. **Busemeyer, J. R., & Bruza, P. D.** (2012). *Quantum Models of Cognition and Decision*. Cambridge University Press.

4. **Pothos, E. M., & Busemeyer, J. R.** (2013). Can quantum probability provide a new direction for cognitive modeling? *Behavioral and Brain Sciences*, 36(3), 255–274.

5. **MacLeod, C. M.** (1991). Half a century of research on the Stroop effect: An integrative review. *Psychological Bulletin*, 109(2), 163–203.

6. **Egner, T.** (2007). Congruency sequence effects and cognitive control. *Cognitive, Affective, & Behavioral Neuroscience*, 7(4), 380–390.

---

## 📖 Como Citar

### Formato APA 7ª edição

```
Amador, J. A., & Pereira Júnior, A. (2025). Experimento Stroop: Dinâmica 
Contextual Sequencial [Software]. Laboratório de Processamento de Sinais, 
Instituto de Tecnologia, Universidade Federal do Pará. 
https://github.com/SEU-USUARIO/stroop-experiment-ufpa
```

### BibTeX

```bibtex
@software{amador2025stroop,
  author = {Amador, Jos{\'e} Ant{\^o}nio and Pereira J{\'u}nior, Antonio},
  title = {Experimento Stroop: Din{\^a}mica Contextual Sequencial},
  year = {2025},
  publisher = {GitHub},
  institution = {Laborat{\'o}rio de Processamento de Sinais, 
                 Instituto de Tecnologia, 
                 Universidade Federal do Par{\'a}},
  url = {https://github.com/SEU-USUARIO/stroop-experiment-ufpa}
}
```

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

```
MIT License

Copyright (c) 2025 José Antônio Amador, Antonio Pereira Júnior
Laboratório de Processamento de Sinais (LaPS) - UFPA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contribuições

Este é um projeto de pesquisa científica. Contribuições são bem-vindas através de:

- **Issues**: Reporte bugs ou sugira melhorias
- **Pull Requests**: Correções de bugs ou implementação de recursos
- **Discussões**: Sugestões metodológicas ou teóricas

### Diretrizes para Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Importante**: Mudanças na lógica experimental devem ser discutidas com a equipe de pesquisa antes da implementação.

---

## 📞 Contato

### Dúvidas sobre Participação

Se você é um **participante** com dúvidas:
- 📧 jose.amador@ntpc.ufpa.br
- Assunto: "Dúvida Participante - Código: [SEU-CODIGO]"

### Colaborações Científicas

Se você é um **pesquisador** interessado em colaboração:
- 📧 jose.amador@ntpc.ufpa.br
- Assunto: "Colaboração Científica - Stroop Contextual"

### Questões Técnicas

Para **issues técnicos** com o código:
- Abra um issue no GitHub: [Issues](https://github.com/SEU-USUARIO/stroop-experiment-ufpa/issues)

### Redes Sociais e Links

- **LaPS/UFPA**: [Site institucional - se disponível]
- **ITEC/UFPA**: https://www.itec.ufpa.br

---

## 🎓 Agradecimentos

- **UFPA/ITEC/LaPS** pelo suporte institucional
- **Comitê de Ética em Pesquisa da UFPA** pela avaliação e aprovação
- **Todos os participantes** que contribuíram com seu tempo para esta pesquisa
- Comunidade open-source por ferramentas como React, Vite e TypeScript

---

## 📊 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/SEU-USUARIO/stroop-experiment-ufpa)
![GitHub issues](https://img.shields.io/github/issues/SEU-USUARIO/stroop-experiment-ufpa)
![GitHub stars](https://img.shields.io/github/stars/SEU-USUARIO/stroop-experiment-ufpa?style=social)

**Versão atual**: 1.0.0  
**Status**: Ativo - Coleta de dados em andamento  
**Última atualização**: Janeiro 2025

---

<div align="center">

**Desenvolvido com ❤️ e rigor científico**

**Laboratório de Processamento de Sinais (LaPS)**  
**Instituto de Tecnologia (ITEC)**  
**Universidade Federal do Pará (UFPA)**

🔬 *Contribuindo para o avanço do conhecimento em neurociências cognitivas*

</div>
