/* @flow */

import APIBase from './base';

import type { Locale } from 'core/locales';
import type { MachineryTranslation } from './types';


type Translations = Array<MachineryTranslation>;


export default class MachineryAPI extends APIBase {
    async _get(url: string, params: Object) {
        const payload = new URLSearchParams();
        for (let param in params) {
            payload.append(param, params[param]);
        }

        const headers = new Headers();
        headers.append('X-Requested-With', 'XMLHttpRequest');

        return await this.fetch(url, 'GET', payload, headers);
    }

    /**
     * Return translations from Pontoon's memory.
     */
    async getTranslationMemory(source: string, locale: Locale, pk: ?number): Promise<Translations> {
        const url = '/translation-memory/';
        const params = {
            text: source,
            locale: locale.code,
            pk: (pk || '').toString(),
        };

        const results = await this._get(url, params);

        return results.map(item => {
            return {
                sources: [{
                    type: 'Translation memory',
                    url: '/',
                    title: 'Pontoon Homepage',
                    count: item.count,
                }],
                original: item.source,
                translation: item.target,
                quality: Math.round(item.quality),
            };
        });
    }

    /**
     * Return translation by Google Translate.
     */
    async getGoogleTranslation(source: string, locale: Locale): Promise<Translations> {
        const url = '/google-translate/';
        const params = {
            text: source,
            locale: locale.googleTranslateCode,
        };

        const result = await this._get(url, params);

        if (!result.translation) {
            return [];
        }

        return [{
            sources: [{
                type: 'Google Translate',
                url: 'https://translate.google.com/',
                title: 'Visit Google Translate',
            }],
            original: source,
            translation: result.translation,
        }];
    }

    /**
     * Return translation by Microsoft Translator.
     */
    async getMicrosoftTranslation(source: string, locale: Locale): Promise<Translations> {
        const url = '/microsoft-translator/';
        const params = {
            text: source,
            locale: locale.msTranslatorCode,
        };

        const result = await this._get(url, params);

        if (!result.translation) {
            return [];
        }

        return [{
            sources: [{
                type: 'Microsoft Translator',
                url: 'https://www.bing.com/translator',
                title: 'Visit Bing Translator',
            }],
            original: source,
            translation: result.translation,
        }];
    }

    /**
     * Return translations from Microsoft Terminology.
     */
    async getMicrosoftTerminology(source: string, locale: Locale): Promise<Translations> {
        const url = '/microsoft-terminology/';
        const params = {
            text: source,
            locale: locale.msTerminologyCode,
        };

        const results = await this._get(url, params);

        if (!results.translations) {
            return [];
        }

        return results.translations.map(item => {
            return {
                sources: [{
                    type: 'Microsoft',
                    url: 'https://www.microsoft.com/Language/en-US/Search.aspx?sString=' +
                        item.source + '&langID=' + locale.msTerminologyCode,
                    title: 'Visit Microsoft Terminology Service API.\n' +
                        '© 2018 Microsoft Corporation. All rights reserved.',
                }],
                original: item.source,
                translation: item.target,
                quality: Math.round(item.quality),
            };
        });
    }

    /**
     * Return translations from Transvision.
     */
    async getTransvisionMemory(source: string, locale: Locale): Promise<Translations> {
        const url = '/transvision/';
        const params = {
            text: source,
            locale: locale.code,
        };

        const results = await this._get(url, params);

        return results.map(item => {
            return {
                sources: [{
                    type: 'Mozilla',
                    url: 'https://transvision.mozfr.org/?repo=global' +
                        '&recherche=' + encodeURIComponent(source) +
                        '&locale=' + locale.code,
                    title: 'Visit Transvision',
                }],
                original: item.source,
                translation: item.target,
                quality: Math.round(item.quality),
            };
        });
    }

    /**
     * Return translation by Caighdean Machine Translation.
     *
     * Works only for the `ga-IE` locale.
     */
    async getCaighdeanTranslation(source: string, locale: Locale, pk: number): Promise<Translations> {
        const url = '/caighdean/';
        const params = {
            id: pk,
            locale: locale.code,
        };

        const result = await this._get(url, params);

        if (!result.translation) {
            return [];
        }

        return [{
            sources: [{
                type: 'Caighdean',
                url: 'https://github.com/kscanne/caighdean',
                title: 'Visit Caighdean Machine Translation',
            }],
            original: result.original,
            translation: result.translation,
        }];
    }
}
