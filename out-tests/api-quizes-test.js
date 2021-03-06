'use strict';
var mocha = require('mocha');
var chakram = require('chakram');
var request = chakram.request;
var expect = chakram.expect;

chakram.schemaBanUnknown = true;

describe('tests for /api/quizes', function() {
    describe('tests for get', function() {
        it('should respond 200 for "Quiz list response"', function() {
            var response = request('get', 'http://localhost:3333/api/quizes', { 
                'headers': {"Accept":"application/json"},
                'time': true
            });

            expect(response).to.have.status(200)
        expect(response).to.have.schema({"type":"object","required":["data","success"],"properties":{"success":{"type":"boolean"},"data":{"type":"array","items":{"type":"object","required":["description","descriptionFull","id","name","randomizeItems","shortName","timeLimit"],"properties":{"id":{"type":"string"},"shortName":{"type":"string"},"name":{"type":"string"},"description":{"type":"string"},"descriptionFull":{"type":"string"},"timeLimit":{"type":"integer","format":"int32"},"randomizeItems":{"type":"boolean"}},"additionalProperties":{}}}},"additionalProperties":{}});
            return chakram.wait();
        });    
    });
});