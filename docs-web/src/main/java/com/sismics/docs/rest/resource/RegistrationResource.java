package com.sismics.docs.rest.resource;

import com.sismics.docs.core.dao.UserDao;
import com.sismics.docs.core.model.jpa.RegistrationRequest;
import com.sismics.rest.util.ValidationUtil;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;

/**
 * Registration API resource.
 */
@Path("/registration")
public class RegistrationResource extends BaseResource {
    /**
     * Submit a new registration request.
     */
    @POST
    public Response register(RegistrationRequest request) {
        // Validate required fields
        ValidationUtil.validate(request.getUsername(), "username");
        ValidationUtil.validate(request.getPassword(), "password");
        ValidationUtil.validate(request.getEmail(), "email");

        UserDao userDao = new UserDao();
        userDao.createUserFromRegistration(request);
        
        return Response.ok().build();
    }

    /**
     * Approve a registration request (admin only).
     */
    @PUT
    @Path("/{id}/approve")
    public Response approve(@PathParam("id") String id) {
        UserDao userDao = new UserDao();
        userDao.approveRegistration(id);
        return Response.ok().build();
    }

    /**
     * Reject a registration request (admin only).
     */
    @PUT
    @Path("/{id}/reject")
    public Response reject(@PathParam("id") String id) {
        UserDao userDao = new UserDao();
        userDao.rejectRegistration(id);
        return Response.ok().build();
    }
}