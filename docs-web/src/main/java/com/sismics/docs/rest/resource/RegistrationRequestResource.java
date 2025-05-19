package com.sismics.docs.rest.resource;

import com.sismics.docs.core.dao.RegistrationRequestDao;
import com.sismics.docs.core.model.jpa.RegistrationRequest;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

@Path("/registration")
public class RegistrationRequestResource {
    @POST
    public Response submitRegistration(RegistrationRequest request) {
        new RegistrationRequestDao().create(request);
        return Response.ok().build();
    }

    @PUT
    @Path("/{id}")
    public Response updateStatus(@PathParam("id") String id, @QueryParam("status") String status) {
        RegistrationRequestDao requestDao = new RegistrationRequestDao();
        RegistrationRequest request = requestDao.getById(id);
        
        if ("APPROVED".equals(status)) {
            UserDao userDao = new UserDao();
            userDao.createUserFromRegistration(request);
            
            // Optionally delete the request after approval
            requestDao.update(request);
        }

        return Response.ok().build();
    }
}