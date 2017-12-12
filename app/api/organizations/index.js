'use strict';

const router = require('express').Router();
const Organizations = require('./organisations.model');
const log = require('../../services/log').logger;

// API for organizations
router.route('/organizations')
    // create organization
    .post((req, res) => {
        log.verbose("POST /organizations: " + JSON.stringify(req.body));
        const org = new Organizations();
        org.name = req.body.name;
        org.start = req.body.start || Date.now();
        org.end = req.body.end || null;
        org.present = !!!org.end;
        org.save().then(organisation => {
            return res.status(201).json(organisation);
        }).catch(err => {
            log.error(err);
            return res.status(500).json({
                message: err.message
            });
        });
    })
    // get all organizations
    .get((req, res) => {
        log.verbose(`GET /organizations`);
        Organizations.find().then(organizations => {
            return res.json(organizations);
        }).catch(err => {
            log.error(err);
            return res.status(500).json({
                message: err.message
            });
        });
    });

router.route('/organizations/:id')
    // get organization
    .get((req, res) => {
        log.verbose(`GET /organizations/${req.params.id}`);
        Organizations.findById(req.params.id).then(organization => {
            return res.json(organization);
        }).catch(err => {
            log.error(err);
            return res.status(500).json({
                message: err.message
            });
        });
    })
    // update organization
    .put((req, res) => {
        log.verbose(`PUT /organizations/${req.params.id}: ${JSON.stringify(req.body)}`);
        Organizations.findById(req.params.id).then(organization => {
            organization.name = req.body.name ? req.body.name : organization.name;
            organization.start = req.body.start ? req.body.start : organization.start;
            organization.end = req.body.end ? req.body.end : organization.end;
            organization.present = !!!organization.end;
            return organization.save();
        }).then(organization => {
            return res.json(organization);
        }).catch(err => {
            log.error(err);
            return res.status(500).json({
                message: err.message
            });
        });
    })
    // delete an oraganization
    .delete((req, res) => {
        log.verbose(`DELETE /organizations/${req.params.id}`);
        Organizations.findByIdAndRemove(req.params.id).then(organization => {
            return res.json(organization);
        }).catch(err => {
            log.error(err);
            return res.status(500).json({
                message: err.message
            });
        });
    });

module.exports = router;