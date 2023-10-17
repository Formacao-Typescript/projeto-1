# Pai

```ts
interface Pai {
  id: string
  nome?: string,
  sobrenome: string
  enderecos: {
    linha1: string
    linha2?: string
    cidade: string
    estado: string
    cep: string
    pais: string
  }[]
  telefones: string[]
  emails: string[]
}
```

# Aluno

```ts
interface Aluno {
  id: string
  nome: string
  sobrenome: string
  dataNascimento: Date
  tipoSanguineo: string
  alergias?: string[]
  medicamentos?: string[]
  dataMatricula: Date
  documento: string
  responsaveis: PaiId[]
}
```

# Professor

```ts
interface Professor {
  id: string
  nome: string
  sobrenome: string
  documento: string
  telefone: string
  email: string
  contratacao: Date
  salario: number
  especializacao: string
}
```

# Turma

```ts
interface Turma {
  id: string
  codigo: string
  professor: Professor
  alunos: AlunoId[]
}
```
