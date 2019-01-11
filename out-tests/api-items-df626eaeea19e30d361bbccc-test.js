'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

chakram.schemaBanUnknown = true;

describe('tests for /api/items/df626eaeea19e30d361bbccc', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Quiz item response"', function() {
            var response = request('get', 'http://localhost:3333/api/items/df626eaeea19e30d361bbccc', { 
                'headers': {"Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200)
            expect(response).to.have.schema({"type":"object","required":["data","success"],"properties":{"success":{"type":"boolean"},"data":{"type":"object","required":["choices","id","question","quizId","randomizeChoices","singleChoice"],"properties":{"id":{"type":"string"},"quizId":{"type":"string"},"question":{"type":"string"},"choices":{"type":"array","items":{"type":"object","required":["id","text"],"properties":{"id":{"type":"string"},"text":{"type":"string"}},"additionalProperties":{}}},"randomizeChoices":{"type":"boolean"},"singleChoice":{"type":"boolean"}},"additionalProperties":{}}},"additionalProperties":{}});
            return chakram.wait();
        });    
    });
});