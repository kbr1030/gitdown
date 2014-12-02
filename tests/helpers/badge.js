var expect = require('chai').expect,
    requireNew = require('require-new');

describe('Parser.helpers.badge', function () {
    var helper,
        gitinfoContext;
    beforeEach(function () {
        helper = requireNew('../../src/helpers/badge.js');
        gitinfoContext = {
            parser: {
                helpers: function () {
                    return {
                        gitinfo: {
                            compile: function (config) {
                                if (config.name == 'username') {
                                    return 'a';
                                } else if (config.name == 'name') {
                                    return 'b';
                                } else if (config.name == 'branch') {
                                    return 'c';
                                }
                            }
                        }
                    }
                }
            }
        };
    });
    it('throws an error when config.name is not provided', function () {
        expect(function () {
            helper.compile()
        }).to.throw(Error, 'config.name must be provided.');
    });
    it('throws an error if unknown config.name is provided', function () {
        expect(function () {
            helper.compile({name: 'foo'})
        }).to.throw(Error, 'config.name "foo" is unknown service.');
    });
    describe('services', function () {
        describe('npm-version', function () {
            it('throws an error if package.json is not found in the root of the repository', function () {
                var context;

                context = {locator: {repositoryPath: function () { return __dirname; }}};

                expect(function () {
                    helper.compile({name: 'npm-version'}, context);
                }).to.throw(Error, './package.json is not found.');
            });
            it('returns markdown for the NPM badge', function () {
                var context,
                    badge;

                context = {locator: {repositoryPath: function () { return __dirname + '/../fixtures/badge'; }}};
                badge = helper.compile({name: 'npm-version'}, context);

                expect(badge).to.equal('[![NPM version](http://img.shields.io/npm/v/gitdown.svg?style=flat)](https://www.npmjs.org/package/gitdown)');
            });
        });
        describe('bower-version', function () {
            it('throws an error if bower.json is not found in the root of the repository', function () {
                var context;

                context = {locator: {repositoryPath: function () { return __dirname; }}};

                expect(function () {
                    helper.compile({name: 'bower-version'}, context);
                }).to.throw(Error, './bower.json is not found.');
            });
            it('returns markdown for the Bower badge', function () {
                var context,
                    badge;

                context = {locator: {repositoryPath: function () { return __dirname + '/../fixtures/badge'; }}};

                badge = helper.compile({name: 'bower-version'}, context);

                expect(badge).to.equal('[![Bower version](http://img.shields.io/bower/v/gitdown.svg?style=flat)](http://bower.io/search/?q=gitdown)');
            });
        });
        describe('david', function () {
            it('returns markdown for the david badge', function () {
                var badge;

                badge = helper.compile({name: 'david'}, gitinfoContext);

                expect(badge).to.equal('[![Dependency Status](https://david-dm.org/a/b.svg?style=flat)](https://david-dm.org/a/b)');
            });
        });
        describe('david-dev', function () {
            it('returns markdown for the david badge', function () {
                var badge;

                badge = helper.compile({name: 'david-dev'}, gitinfoContext);

                expect(badge).to.equal('[![Dependency Status](https://david-dm.org/a/b/dev-status.svg?style=flat)](https://david-dm.org/a/b#info=devDependencies)');
            });
        });
        describe('travis', function () {
            it('returns markdown for the travis badge', function () {
                var badge;

                badge = helper.compile({name: 'travis'}, gitinfoContext);

                expect(badge).to.equal('[![Travis build status](http://img.shields.io/travis/a/b/c.svg?style=flat)](https://travis-ci.org/a/b)');
            });
        });
    });
});