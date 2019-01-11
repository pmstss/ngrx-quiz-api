'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

chakram.schemaBanUnknown = true;

describe('tests for /api/answers/df626eaeea19e30d361bbccc', function() {
    describe('tests for post', function() {
        it('should respond 200 for "Submit answer response"', function() {
            var response = request('post', 'http://localhost:3333/api/answers/df626eaeea19e30d361bbccc', { 
                'body': {"choiceIds":[]},
                'headers': {"Content-Type":"application/json","Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200)
            expect(response).to.have.schema({"type":"object","required":["data","success"],"properties":{"success":{"type":"boolean"},"data":{"type":"object","required":["choices","correct"],"properties":{"choices":{"type":"array","items":{"type":"object","required":["correct","explanation","id","popularity"],"properties":{"id":{"type":"string"},"explanation":{"type":"string"},"correct":{"type":"boolean"},"popularity":{"type":"number","format":"integer"}},"additionalProperties":{}}},"correct":{"type":"boolean"}},"additionalProperties":{}}},"additionalProperties":{}});
            return chakram.wait();
        });    
    });
});