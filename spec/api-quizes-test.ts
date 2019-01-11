import { describe } from 'mocha';
import { wrapArray, wrap } from './schemas/wrapper';
import { quizMetaSchemaShort, quizMetaSchema } from './schemas/quiz-meta';

const chakram = require('chakram');
chakram.schemaBanUnknown = true;

describe('/api/quizes', () => {
    describe('GET /api/quizes - getting quiz list tests', () => {
        before('making get request', () => {
            this.response = chakram.request(
                'get',
                'http://localhost:3333/api/quizes',
                {
                    headers: { Accept: 'application/json' }
                }
            );
            this.response.then((r: any) => this.firstQuiz = r.body.data[0]);
        });

        it('should respond 200', () => {
            chakram.expect(this.response).to.have.status(200);
            return chakram.wait();
        });

        it('response should match schema', () => {
            chakram.expect(this.response).to.have.schema(wrapArray(quizMetaSchemaShort));
            return chakram.wait();
        });
    });

    describe('GET /api/quizes/:shortName - getting single quiz meta tests', () => {
        before('making get request', () => {
            this.response = chakram.request(
                'get',
                `http://localhost:3333/api/quizes/${this.firstQuiz.shortName}`,
                {
                    headers: { Accept: 'application/json' }
                }
            );
        });

        it('should respond 200', () => {
            chakram.expect(this.response).to.have.status(200);
            return chakram.wait();
        });

        it('response should match schema', () => {
            chakram.expect(this.response).to.have.schema(wrap(quizMetaSchema));
            return chakram.wait();
        });
    });
});
