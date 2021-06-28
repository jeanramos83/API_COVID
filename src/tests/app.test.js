const app = require('../index');
const request = require ('supertest');
const { validate : isUuid } = require("uuid");
//Nome que descreve o teste
//Ação que vou fazer do teste

    describe("Teste 1 - Criar novo paciente", () =>{
        it ("POST", async () =>{
        
            //Chamada API metodo POST
            const response = await request(app)
            .post("/")
            .send({

                "name" : "Jean",
                cpf : 123,
                peso : 100,
                altura : 1.90,
               
            })
                .expect(200);
                expect(isUuid(response.body.newPaciente.id)).toBe(true);
                expect(response.body).toMatchObject({

                "newPaciente": {
                        "name" : "Jean",
                        cpf : 123,
                        peso : 100,
                        altura : 1.90,
                        imc :  27.3,
                        "classificacao" : "Sobrepeso"


                }
            

                });
             });
         });

         describe("Teste 2 - deletar um paciente que não existe", () => {
            it("DELETE - paciente 123 que não existe", async () => {
                await request(app).delete('/123')
                    .expect(404);
            });
        });

        describe("Teste 3 - atualização de um paciente", () => {
            //2 passos cadastrar um paciente e depois eu vou atualizar ele
            it("POST e PUT - teste metodo atualizar paciente", async () => {
                //chamada da API no metodo POST
                const response = await request(app)
                    .post("/")
                    .send({
                        "name" : "Jean",
                         cpf : 123,
                         peso : 100,
                        altura : 1.90
                    })
                    .expect(200);
                expect(isUuid(response.body.newPaciente.id)).toBe(true);
                expect(response.body).toMatchObject({
                   
                    "newPaciente": {
                        "name" : "Jean",
                        cpf : 123,
                        peso : 100,
                        altura : 1.90,
                        imc :  27.5,
                        "classificacao" : "Sobrepeso"
                    }
                });
                
                //atualizar esse paciente
        
                const responseUpd = await request(app)
                    .put(`/${response.body.newPaciente.id}`)
                    .send({
                        "name" : "Jean",
                         cpf : 123,
                         peso : 100,
                        altura : 1.90
                    })
                    .expect(200);
                expect(responseUpd.body).toMatchObject({
                    "name" : "Jean",
                    cpf : 123,
                    peso : 100,
                   altura : 1.90
                });
            });
        });
        
        afterAll(done => {
            app.close();
            done();
        });