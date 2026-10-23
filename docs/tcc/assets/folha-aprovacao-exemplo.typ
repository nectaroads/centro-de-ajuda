#set page(margin: 2cm)
#set text(size: 12pt, font: "New Computer Modern")
#align(center, upper(text(weight: "bold")[Folha de Aprovação]))
#v(1em)
#align(left)[
  Trabalho de Conclusão de Curso de autoria de *Sandro de Souza*, intitulado *Desenvolvimento de um Sistema de TCC Autogerado para o IFBA SAJ*, apresentado ao Instituto Federal da Bahia, campus Santo Antônio de Jesus, como requisito para obtenção do título de Tecnólogo em Análise e Desenvolvimento de Sistemas, aprovado em ____ de ______________ de 2026 pela banca:
]
#v(2em)
#let banca = (
  "Prof. Dr. Orientador do IFBA \ Presidente",
  "Prof. Dr. Fulano de Tal \ IFBA",
  "Prof. Dr. Beltrano de Tal \ UFBA",
)
#for m in banca {
  v(1.2cm)
  align(center, line(length: 10cm, stroke: 0.5pt))
  align(center, text(size: 10pt, m))
  v(0.5em)
}
